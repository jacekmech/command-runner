const CommandReader = require('./CommandReader');

const executeCommand = async (commands, argv) => {
    const commandsNamed = commands.reduce((accum, command) => {
        return { ...accum, [command.getName()]: command };
    }, {});
    const commandReader = new CommandReader(commandsNamed, argv);
    commandReader.load();
    if (commandReader.isCorrect()) {
        const command = commandReader.getCommand();
        const commandObj = commandsNamed[command];
        await commandObj.execute(commandReader.getOptions());
    }

    return commandReader.isCorrect();
};

module.exports = executeCommand;
