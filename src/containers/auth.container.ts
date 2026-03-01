import { IEmailService } from '../interfaces/services';
import { AuthService } from '../services/auth.service';
import { sendSetPasswordEmail } from '../utils/sendEmail';
import { AuthController } from '../controllers/auth.controller';
import { RoleRepository } from '../repositories/roles.repository';
import { UserRepository } from '../repositories/users.repository';
import { createAuthMiddleware } from '../middlewares/isAuthenticated';
import { BranchRepository } from '../repositories/branches.repository';
import { RefreshTokenRepository } from '../repositories/refresh-tokens.repository';
import { SetPasswordTokenRepository } from '../repositories/set-password-tokens.repository';

// ----- Adapters (thin wrappers around utilities) -----

const emailService: IEmailService = {
  sendSetPasswordEmail,
};

// ----- Repositories -----

const branchRepository = new BranchRepository();
export const userRepository = new UserRepository();
export const roleRepository = new RoleRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const setPasswordTokenRepository = new SetPasswordTokenRepository();

// ----- Services -----

export const authService = new AuthService(
  userRepository,
  setPasswordTokenRepository,
  refreshTokenRepository,
  roleRepository,
  emailService,
  branchRepository,
);

// ----- Controllers -----

export const authController = new AuthController(authService);

// ----- Middlewares -----

export const isAuthenticated = createAuthMiddleware(
  userRepository,
  roleRepository,
);
