const executeCommand = require('../src/commands/executeCommand.js');

const { beforeAction, afterAction } = require('./setup.js');

beforeAll(async () => {
    await beforeAction();
});

afterAll(async () => {
    await afterAction();
});

class TestCommand {

    constructor() {
        this.executed = false;
        this.executeOptions = null;
    }

    execute(options) {
        this.executed = true;
        this.executeOptions = options;
    }
}

class Command1 extends TestCommand {

    getName() {
        return 'command1';
    }

    getOptions() {
        return [];
    }
}

class Command2 extends TestCommand {

    getName() {
        return 'command2';
    }

    getOptions() {
        return [{
            name: 'option1', type: String, required: true,
        }];
    }
}

const command1 = new Command1();
const command2 = new Command2();

const commands = [command1, command2];

test('executeCommand successful', () => {
    executeCommand(commands, ['node', 'executable', 'command1']);
    expect(command1.executed).toBeTruthy();
});

test('executeCommand with required option failed', () => {
    executeCommand(commands, ['node', 'executable', 'command2']);
    expect(command2.executed).toBeFalsy();
});

test('executeCommand with required option successful', () => {
    executeCommand(commands, ['node', 'executable', 'command2', '--option1', 'value1']);
    expect(command2.executed).toBeTruthy();
});

test('executeCommand with required option loaded as RC successful', () => {
    executeCommand(commands, ['node', 'executable', 'command2'], { option1: 'value' });
    expect(command2.executed).toBeTruthy();
});
