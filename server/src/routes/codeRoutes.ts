import express from 'express';
import type { Request, Response } from 'express';
import axios from 'axios';
import { pathSplitter, childrenMaker } from '../functions/index.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

interface GithubTree {
    path: string;
    mode: string;
    type: string;
    sha: string;
    size: number;
    url: string;
}
interface GithubResponse {
  sha: string;
  url: string;
  tree: GithubTree[];
  truncated: boolean;
}

declare global {
  namespace Express {
    interface Request {
      email?: string;
    }
  }
}

// Get Code Tree from GitHub Repository
router.get('/codetree', userAuth, async (req: Request, res: Response) => {
  const githubId = req.query.githubId as string | undefined;
  const repo = req.query.repo as string | undefined;
  const branch = (req.query.branch as string | undefined) ?? 'main';

  if (!githubId || !repo) {
    res.status(400).json({ message: 'GitHub ID or repo missing' });
    return;
  }

  try {
    const response = await axios.get<GithubResponse>(
      `https://api.github.com/repos/${githubId}/${repo}/git/trees/${branch}?recursive=1`
    );

    const rawPaths = response.data.tree
      .filter((item) => item.type === 'blob' || item.type === 'tree')
      .map((item) => item.path)
      .filter((path): path is string => Boolean(path));

    const validPaths = rawPaths.filter((path) => pathSplitter(path).length > 0);
    const tree = childrenMaker(validPaths);

    res.status(200).json({ tree, truncated: response.data.truncated });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        error.response?.data?.message || 'Failed to fetch repository tree';
      res.status(status).json({ message });
      return;
    }

    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Raw File Content from GitHub Repository
router.get('/filecontent', userAuth, async (req: Request, res: Response) => {
  const githubId = req.query.githubId as string | undefined;
  const repo = req.query.repo as string | undefined;
  const filePath = req.query.filePath as string | undefined;
  const branch = (req.query.branch as string | undefined) ?? 'main';

  if (!githubId || !repo || !filePath) {
    res.status(400).json({ message: 'GitHub ID, repo, or filePath missing' });
    return;
  }

  try {
    const response = await axios.get<string>(
      `https://raw.githubusercontent.com/${githubId}/${repo}/${branch}/${filePath}`,
      { responseType: 'text' }
    );

    res.status(200).json({ content: response.data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        error.response?.data?.message || 'Failed to fetch file content';
      res.status(status).json({ message });
      return;
    }

    res.status(500).json({ message: 'Server Error' });
  }
});


export default router;

