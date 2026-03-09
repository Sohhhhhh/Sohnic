import { IEmailService } from '../interfaces/services';
import { AuthService } from '../services/auth.service';
import { sendSetPasswordEmail } from '../utils/sendEmail';
import { AuthController } from '../controllers/auth.controller';
import {
  branchesRepository,
  refreshTokensRepository,
  rolesRepository,
  setPasswordTokensRepository,
  usersRepository,
} from './repositories.container';

// ----- Adapters (thin wrappers around utilities) -----

const emailService: IEmailService = {
  sendSetPasswordEmail,
};

// ----- Services -----

export const authService = new AuthService(
  setPasswordTokensRepository,
  refreshTokensRepository,
  emailService,
  usersRepository,
  rolesRepository,
  branchesRepository,
);

// ----- Controllers -----

export const authController = new AuthController(authService);
