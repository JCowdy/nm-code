const chalk = require('chalk');
const LEVELS = {
    INFO: 'info',
    WARN: 'warning',
    ERROR: 'error',
    DEBUG: 'debug'
};
const TRANSPORT_ACTIONS = {};
TRANSPORT_ACTIONS[LEVELS.INFO] = (message) => { console.log(chalk.green(message)); }
TRANSPORT_ACTIONS[LEVELS.WARN] = (message) => { console.log(chalk.yellow(message)); }
TRANSPORT_ACTIONS[LEVELS.ERROR] = (message) => { console.log(chalk.red(message)); }
TRANSPORT_ACTIONS[LEVELS.DEBUG] = (message) => { console.log(chalk.blue(message)); }
const DEFAULT_ROOT = 'root';
const DEFAULT_LEVEL = LEVELS.INFO;

function logger(config = {}) {
    this.root = config.root || DEFAULT_ROOT;

    if (config.format) {
        this.format = config.format;
    }

    if (config.transport) {
        this.transport = config.transport;
    }
}

logger.prototype = {
    log(data, level) {
        const logObj = this.createLogObject(data, level);
        const message = this.format(logObj);
        this.transport(level, message);
    },

    createLogObject(data, level) {
        let rootObj;

        if (this.root) {
            rootObj = { root: this.root };
        }

        const adjData = typeof data === 'string' ? { message: data } : data;
        return Object.assign(rootObj, adjData, {
          level: level || DEFAULT_LEVEL
        });
    },

    format(logObj) {
        return JSON.stringify(logObj);
    },

    transport(level, message) {
        if (TRANSPORT_ACTIONS[level]) {
            TRANSPORT_ACTIONS[level](message);
        } else {
            TRANSPORT_ACTIONS[DEFAULT_LEVEL](message);
        }
    }
};

module.exports = { logger, LEVELS };
