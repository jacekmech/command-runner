const winston = require('winston');

const createTestLogger = () => {
    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf((info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`),
            winston.format.colorize({ all: true }),
        ),
        transports: [
            new winston.transports.Console(),
        ],
    });

    winston.remove(logger.transports.Console);
    winston.add(logger);

    logger.debug('Default logger created');
    return logger;
};

module.exports = createTestLogger;
