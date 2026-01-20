import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION. Shutting down...', err);

  process.exit(1);
});

export const server = app.listen(PORT, () => {
  console.info(`Server is running on port: ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION. Shutting down...', err);

  server.close(() => {
    process.exit(1);
  });
});
