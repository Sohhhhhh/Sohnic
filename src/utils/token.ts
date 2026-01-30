import crypto from 'crypto';

export const generateSetPasswordToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
