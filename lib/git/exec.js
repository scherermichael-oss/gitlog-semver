'use strict';

const shell = require('shelljs');

const exec = function (command, callback) {
  if (!command) {
    throw new Error('Command is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  const shellExec = shell.exec(`git ${command}`, { silent: true });

  if (shellExec.code !== 0) {
    return callback(new Error(`'git ${command}' returned an error: ${shellExec.stderr}`));
  }

  callback(null, shellExec.stdout.replace(/\n$/, ''));
};

module.exports = exec;
