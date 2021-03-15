import pino from 'pino';

// documentation: http://getpino.io/#/
export const logger = pino({ level: process.env.LOGGER_LEVEL || 'info' });

logger.info(`Setting logger level to ${logger.level}`);

export default { logger };
