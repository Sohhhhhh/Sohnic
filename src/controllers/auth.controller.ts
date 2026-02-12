import { RequestHandler } from 'express';
import { APIResponse } from '../types/api.types';
import authService from '../services/auth.service';
import { sendResponse } from '../utils/sendResponse';
import { EncodedToken } from '../dtos/setPassword.dto';
import { ForgetPasswordDto } from '../dtos/forgetPassword.dto';

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

export const forgetPassword: RequestHandler<ForgetPasswordDto> = async (
  req,
  res,
) => {
  const result = await authService.forgetPassword(req.body);
  sendResponse(res, result);
};

export const changePassword: RequestHandler = async (req, res) => {
  const result = await authService.changePassword(req.body);
  sendResponse(res, result);
};
