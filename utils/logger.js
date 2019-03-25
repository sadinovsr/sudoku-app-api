import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf, colorize, align, splat } = format;

const logsFormat = printf(info => {
  const time = info.timestamp.slice(0, 19). replace('T', ' ');
  return `${time} ${info.level} ${info.label}: ${info.message}`;
});

const Logger = fileName => {
  let level = 'info';
  const consoleLogger = new transports.Console({
    level,
    format: combine(
      colorize(),
      timestamp(),
      align(),
      label({ label: fileName }),
      splat(),
      logsFormat,
    )
  });
  const fileLogger = new transports.File({
    filename: `logs/combined.log`,
    level: 'debug',
    maxsize: 5242880,
    maxFiles: 3,
    format: combine(
      timestamp(),
      align(),
      label({ label: fileName }),
      splat(),
      logsFormat
    )
  });
  const transportsArray = [fileLogger];
  if (process.env.NODE_ENV !== 'test') {
    transportsArray.push(consoleLogger);
  }
  const logger = createLogger({
    transports: transportsArray
  });
  return logger;
}
module.exports = Logger;