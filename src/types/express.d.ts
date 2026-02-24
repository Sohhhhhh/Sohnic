import { AuthenticatedUser } from '../utils/sanitize';

declare global {
  namespace Express {
    interface Request {
      params: {
        encodedToken?: string;
      };
    }
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
