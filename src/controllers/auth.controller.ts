import { RequestHandler } from 'express';
import { APIResponse } from '../types/api.types';
import authService from '../services/auth.service';
import { sendResponse } from '../utils/sendResponse';
import { EncodedToken } from '../dtos/setPassword.dto';

export const createUser: RequestHandler = async (req, res, next) => {
  const result: APIResponse = await authService.createUser(req.body);
  sendResponse(res, result);
};

export const setPassword: RequestHandler<EncodedToken> = async (req, res) => {
  const result = await authService.setPassword(
    req.params.encodedToken,
    req.body,
  );
  sendResponse(res, result);
};
