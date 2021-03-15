const logger = require('winston');

const commandLineCommands = require('command-line-commands');
const commandLineArgs = require('command-line-args');
const requiredOptions = require('./requiredOptions');

const errorHandlers = {
    INVALID_COMMAND: (error) => {
        logger.error(`'${error.command}' is not a valid command.`);
    },
    UNKNOWN_VALUE: (error) => {
        logger.error(`'${error.value}' is not a valid parameter.`);
    },
    UNKNOWN_OPTION: (error) => {
        logger.error(`'${error.optionName}' is not a valid option.`);
    },
    OPTION_NOT_SPECIFIED: (error) => {
        logger.error(`'${error.optionName}' option is required.`);
    },
};

class CommandReader {

    constructor(commandsNamed, argv) {
        this.argv = argv.slice(2);
        this.commandsNamed = commandsNamed;
        this.loaded = false;
        this.correct = true;
        this.command = null;
        this.options = null;
    }

    load() {
        const validCommands = Object.keys(this.commandsNamed);
        try {
            const { command, argv: remainingArgv } = commandLineCommands(validCommands, this.argv);
            this.command = command;
            const optionsSpec = this.commandsNamed[command].getOptions();
            this.options = commandLineArgs(optionsSpec, { argv: remainingArgv });
            requiredOptions(optionsSpec, this.options);

        } catch (error) {
            this.correct = false;
            const handle = errorHandlers[error.name];
            if (handle) {
                handle(error);
            } else {
                throw error;
            }
        }

        this.loaded = true;
    }

    isCorrect() {
        return this.correct;
    }

    checkLoaded() {
        if (!this.loaded) {
            throw new Error();
        }
    }

    getCommand() {
        this.checkLoaded();
        return this.command;
    }

    getOptions() {
        this.checkLoaded();
        return this.options;
    }
}

module.exports = CommandReader;
