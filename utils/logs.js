import pino from 'pino';

// documentation: http://getpino.io/#/
export const logger = pino({
  level: process.env.LOGGER_LEVEL || 'info',
  enabled: process.env.NODE_ENV !== 'development',
});

logger.info(`Setting logger level to ${logger.level}`);

export default { logger };
