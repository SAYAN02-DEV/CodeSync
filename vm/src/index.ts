import express, { type Request, type Response } from 'express';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer, WebSocket, type RawData } from 'ws';
import { spawn as spawnPty, type IPty } from 'node-pty';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve runtime configuration with sandbox-friendly defaults.
const STORAGE_ROOT = path.resolve(process.env.STORAGE_ROOT ?? path.join(__dirname, '..', 'workspaces'));
const SANDBOX_USER = process.env.SANDBOX_USER ?? 'sandbox';
const SANDBOX_IMAGE = process.env.SANDBOX_IMAGE ?? 'sandbox:latest';
const REST_PORT = Number(process.env.REST_PORT ?? 4000);
const WS_PORT = Number(process.env.WS_PORT ?? 4001);

fs.mkdirSync(STORAGE_ROOT, { recursive: true });

// REST API handles file writes and session management.
const app = express();
app.use(express.json({ limit: '1mb' }));

const restServer = http.createServer(app);
const wsServer = http.createServer();

// WebSocket server streams terminal IO for active sessions.
const wss = new WebSocketServer({ noServer: true });
const sessions = new Map<string, IPty>();

// Handle WebSocket upgrade manually to parse sessionId from path
wsServer.on('upgrade', (request, socket, head) => {
  const url = request.url ?? '';
  
  // Check if path starts with /term/
  if (!url.startsWith('/term/')) {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Persist editor content inside the per-user workspace.
app.put('/file', (req: Request, res: Response) => {
  const relativePath = String(req.query.path ?? '').replace(/^\/+/, '');
  const absolutePath = path.resolve(STORAGE_ROOT, relativePath);

  if (!absolutePath.startsWith(STORAGE_ROOT)) {
    res.status(400).json({ message: 'Invalid path' });
    return;
  }

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  const content = typeof req.body?.content === 'string' ? req.body.content : '';
  fs.writeFileSync(absolutePath, content, 'utf8');
  res.json({ ok: true });
});
app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'VM Service is running' });
});
// Spin up a sandbox container and return the WebSocket endpoint.
app.post('/session', (req: Request, res: Response) => {
  const projectPath = typeof req.body?.projectPath === 'string' ? req.body.projectPath : '';
  const normalizedRel = projectPath.replace(/^\/+/, '');
  const hostPath = path.resolve(STORAGE_ROOT, normalizedRel);

  if (!hostPath.startsWith(STORAGE_ROOT)) {
    res.status(400).json({ message: 'Invalid project path' });
    return;
  }

  fs.mkdirSync(hostPath, { recursive: true });
// 135.235.137.1
  const sessionId = `sess-${uuidv4()}`;

  const runArgs = [
    'run', '--rm', '--name', sessionId,
    '--network', 'none',
    '--read-only',
    '--memory', '256m',
    '--pids-limit', '64',
    '--cap-drop', 'ALL',
    '-v', `${hostPath}:/home/${SANDBOX_USER}/project:rw`,
    '-w', `/home/${SANDBOX_USER}/project`,
    '-d', SANDBOX_IMAGE,
    '/bin/sh', '-c', 'while true; do sleep 3600; done'
  ];

  const dockerRun = spawn('docker', runArgs);

  dockerRun.on('error', (error) => {
    console.error('docker run error', error);
    res.status(500).json({ message: 'Failed to start container' });
    return;
  });

  // Wait for container to be ready
  let retries = 10;
  const checkContainer = () => {
    const check = spawn('docker', ['inspect', '-f', '{{.State.Running}}', sessionId]);
    let output = '';
    
    check.stdout.on('data', (data) => { output += data.toString(); });
    
    check.on('close', (code) => {
      if (code === 0 && output.trim() === 'true') {
        const protocol = req.protocol === 'https' ? 'wss' : 'ws';
        const hostname = req.get('host')?.split(':')[0] ?? 'localhost';
        const wsUrl = `${protocol}://${hostname}:${WS_PORT}/term/${sessionId}`;
        res.json({ sessionId, wsUrl });
      } else if (retries-- > 0) {
        setTimeout(checkContainer, 300);
      } else {
        res.status(500).json({ message: 'Container failed to start' });
      }
    });
  };
  
  setTimeout(checkContainer, 300);
});

// Bridge WebSocket messages to a docker exec PTY inside the sandbox.
wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
  const url = request.url ?? '';
  const [, sessionId] = url.split('/').filter(Boolean);

  if (!sessionId) {
    ws.close(1008, 'Missing sessionId');
    return;
  }

  const ptyProcess = spawnPty('docker', ['exec', '-it', sessionId, '/bin/sh'], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    env: { TERM: 'xterm-256color' }
  });

  sessions.set(sessionId, ptyProcess);

  ptyProcess.onData((data: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'output', data }));
    }
  });

  ws.on('message', (message: RawData) => {
    try {
      const payload = JSON.parse(message.toString());
      if (payload.type === 'input' && typeof payload.data === 'string') {
        ptyProcess.write(payload.data);
      }
      if (
        payload.type === 'resize' &&
        typeof payload.cols === 'number' &&
        typeof payload.rows === 'number'
      ) {
        ptyProcess.resize(payload.cols, payload.rows);
      }
    } catch (error) {
      console.warn('Invalid websocket payload', error);
    }
  });

  ws.on('close', () => {
    try {
      ptyProcess.kill();
    } catch (error) {
      console.warn('Failed to kill pty', error);
    }

    sessions.delete(sessionId);
  });

  ws.on('error', (error: Error) => {
    console.error('WebSocket error', error);
  });
});

// Expose REST and terminal transports on separate ports.
restServer.listen(REST_PORT, '0.0.0.0', () => {
  console.log(`REST listening on http://0.0.0.0:${REST_PORT}`);
});

wsServer.listen(WS_PORT, '0.0.0.0', () => {
  console.log(`Terminal WS listening on ws://0.0.0.0:${WS_PORT}/term/{sessionId}`);
});