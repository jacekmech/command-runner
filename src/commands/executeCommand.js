const CommandReader = require('./CommandReader');
const loadRc = require('./loadRc');

const executeCommand = async (commands, argv, rcDict) => {

    const rc = loadRc(rcDict);
    const rcArgv = [];
    for (const key of Object.keys(rc)) {
        const value = rc[key];
        rcArgv.push(`--${key}=${value}`);
    }

    const combinedArgv = [...argv, ...rcArgv];
    const commandsNamed = commands.reduce((accum, command) => {
        return { ...accum, [command.getName()]: command };
    }, {});

    const commandReader = new CommandReader(
        commandsNamed,
        combinedArgv,
        Object.keys(rc),
    );
    commandReader.load();

    const commandCorrect = commandReader.isCorrect();
    if (commandCorrect) {
        const command = commandReader.getCommand();
        const commandObj = commandsNamed[command];
        await commandObj.execute(commandReader.getOptions());
    }

    return commandCorrect;
};

module.exports = executeCommand;
