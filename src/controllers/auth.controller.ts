import { RequestHandler } from 'express';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import authService from '../services/auth.service';
import { CreateUserDto } from '../dtos/createUser.dto';

export const createUser: RequestHandler = async (req, res, next) => {
  const result: APIResponse = await authService.createUser(
    req.body as CreateUserDto,
  );
  sendResponse(res, result);
};
