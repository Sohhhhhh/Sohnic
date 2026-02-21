import { Response } from 'express';
import { APIResponse } from '../types/api.types';

export const sendResponse = (res: Response, result: APIResponse) => {
  res.status(result.statusCode).json({
    size: result.size,
    message: result.message,
    data: result.data,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    timestamp: result.timestamp,
  });
};
