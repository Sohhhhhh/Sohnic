import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

export default app;
