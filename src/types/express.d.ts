declare global {
  namespace Express {
    interface Request {
      params: {
        encodedToken?: string;
      };
    }
  }
}
