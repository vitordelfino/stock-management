import { getNamespace } from 'continuation-local-storage';
import winston from 'winston';

const options = {
  console: {
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    prettyPrint: true,
    colorize: process.stdout.isTTY,
  },
};

const formatMessage = (message: string): string => {
  const namespace = getNamespace('session');
  const id = namespace?.get<string>('id');
  return id ? `[${id}] ${message}` : message;
};

const withId = winston.format((info) => {
  info.message = formatMessage(info.message);
  return info;
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false,
  format: withId(),
});

export default logger;
