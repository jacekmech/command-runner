const createTestLogger = require('./createTestLogger');

const beforeAction = async () => {
    createTestLogger();
};

const afterAction = async () => {
};

module.exports = { beforeAction, afterAction };
