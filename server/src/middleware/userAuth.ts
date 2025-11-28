import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: Record<string, unknown>;
  email?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function userAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' });
    return;
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    res.status(401).json({ message: 'Token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload | string;

    if (typeof decoded === 'object' && decoded !== null) {
      req.user = decoded;
      const emailFromToken = decoded.email;
      if (typeof emailFromToken === 'string') {
        req.email = emailFromToken;
      }
    } else {
      req.user = { value: decoded };
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
