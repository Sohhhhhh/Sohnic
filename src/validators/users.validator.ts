import {
  encodedTokenSchema,
  setPasswordBodySchema,
} from '../dtos/users/setPassword.dto';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../dtos/users/login.dto';
import { roleIdSchema } from '../dtos/users/roleId.dto';
import { createUserSchema } from '../dtos/users/createUser.dto';
import { forgetPasswordSchema } from '../dtos/users/forgetPassword.dto';
import { changePasswordSchema } from '../dtos/users/changePassword.dto';

// CREATE USER
export const validateCreateUser = validate({
  body: createUserSchema,
});
export type createUserValidatedCtrlr = typeof validateCreateUser;

// LOGIN
export const validateLogin = validate({
  body: loginSchema,
});
export type loginValidatedCtrlr = typeof validateLogin;

// FORGET PASSWORD
export const validateForgetPass = validate({
  body: forgetPasswordSchema,
});
export type forgetPassValidatedCtrlr = typeof validateForgetPass;

// CHANGE PASSWORD
export const validateChangePass = validate({
  body: changePasswordSchema,
});
export type changePassValidatedCtrlr = typeof validateChangePass;

// ROLE ID
export const validateRoleId = validate({
  body: roleIdSchema,
});
export type roleIdValidatedCtrlr = typeof validateRoleId;

// SET PASSWORD
export const validateSetPassword = validate({
  params: encodedTokenSchema,
  body: setPasswordBodySchema,
});
export type setPasswordValidatedCtrlr = typeof validateSetPassword;
