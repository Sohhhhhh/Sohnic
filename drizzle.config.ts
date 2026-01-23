import { defineConfig } from 'drizzle-kit';
import env from './src/config/env';
export default defineConfig({
  dialect: 'postgresql',
  out: `./drizzle/migrations`,
  schema: `./drizzle/schema/*`,
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
