const { createLogger, format, transports } = require('winston');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

// Common log format
const logFormat = format.printf(({ level, message, timestamp, stack, ...meta }) => {
  const base = `${timestamp} [${level}] ${message}`;
  const stackPart = stack ? `\n${stack}` : '';
  const metaPart = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return base + metaPart + stackPart;
});

const logger = createLogger({
  level:  'info' ,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    logFormat
  ),
  transports: [
    new transports.Console({
      level: isProduction ? 'info' : 'debug',
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        logFormat
      )
    }),
    new transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error'
    }),
    new transports.File({
      filename: path.join('logs', 'combined.log')
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join('logs', 'exceptions.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join('logs', 'rejections.log') })
  ]
});

module.exports = logger;
