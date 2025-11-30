import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: '1mb' }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: "I'm not even supposed to be here today!" });
});

app.listen(port, () => {
  // Quick log on startup
  console.log(`[32mServer running on http://localhost:${port}[0m`);
});
