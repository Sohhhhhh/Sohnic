import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import { APIResponse } from '../types/api.types';
import authService from '../services/auth.service';
import { sendResponse } from '../utils/sendResponse';
import { CreateUserDto } from '../dtos/createUser.dto';

export const createUser: RequestHandler = catchAsync(async (req, res, next) => {
  const result: APIResponse = await authService.createUser(
    req.body as CreateUserDto,
  );
  sendResponse(res, result);
});
