import pino from 'pino';

// documentation: http://getpino.io/#/
export const logger = pino({ level: process.env.LOGGER_LEVEL || 'info' });

export default { logger };
