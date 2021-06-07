import 'reflect-metadata';

import connection from '@config/db';
import { server } from '@config/globals';

import logger from '@middlewares/logger';

connection.then(async () => {
  const app = (await import('./app')).default;
  app.listen(server.port, () => {
    logger.info(`Server running`, server);
  });
});
