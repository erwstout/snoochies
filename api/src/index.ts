import { app } from '@/api/app.js';
import { env } from '@/api/config/env.js';
import { logger } from '@/api/observability/logger.js';

const port = env.PORT;

if (env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}`);
  });
}
