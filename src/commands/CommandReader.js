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

    constructor(commandsNamed, argv, rcKeys) {

        this.commandsNamed = commandsNamed;
        this.argv = argv.slice(2);
        this.rcKeys = rcKeys;

        this.loaded = false;
        this.correct = true;
        this.command = null;
        this.options = null;
    }

    extendOptionsSpecWithRc(optionsSpec) {

        const optionsSpecExtended = [...optionsSpec];
        const optionNames = optionsSpec.reduce((acc, spec) => {
            acc.push(spec.name);
            return acc;
        }, []);

        for (const rcKey of this.rcKeys) {
            if (optionNames.indexOf(rcKey) === -1) {
                optionsSpecExtended.push({
                    name: rcKey, type: String,
                });
            }
        }

        return optionsSpecExtended;
    }

    load() {
        const validCommands = Object.keys(this.commandsNamed);
        try {
            const { command, argv: remainingArgv } = commandLineCommands(validCommands, this.argv);
            this.command = command;
            const optionsSpec = this.commandsNamed[command].getOptions();
            const optionsSpecExtended = this.extendOptionsSpecWithRc(optionsSpec);

            this.options = commandLineArgs(optionsSpecExtended, { argv: remainingArgv });
            requiredOptions(optionsSpecExtended, this.options);

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
