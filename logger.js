const bunyan = require('bunyan');

const streams = [
  {
    stream: process.stdout,
    level: process.env.LOGGER_LEVEL || 'info'
  }, {
    stream: process.stderr,
    level: 'warn'
  }
];

export const logger = bunyan.createLogger({
  name: 'resource-watch',
  src: true,
  streams
});

export default { logger };
