# command-runner

Utility making it easier to execute a command with options.

## Install
```
npm install jacekmech/command-runner
```

## Dependecies
The current version requires `winston` logger to be configured.

## Usage
Check the `test/executeCommand.test.js` to see how commands are supposed to be implemented and provided to the library.

The command options are specified in two ways when executing a command:
- command line options in form of `--name=value`, e.g. 
```
npm run start yourScript.js commandName -- --name1=value1 --name2=value2
```
- .rc file in working directory with key=value content, e.g.
```
name1=value1
name2=value2
```
