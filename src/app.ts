import express from 'express';
import morgan from 'morgan';
import env from './config/env';

const app = express();

app.use(express.json());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// app.use('/api', apiRoutes);
// app.use('/health-check', healthCheck);

// app.use('/api', apiRoutes);

export default app;
