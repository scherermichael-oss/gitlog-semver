'use strict';

const shell = require('shelljs');

const git = function (command, callback) {
  if (!command) {
    throw new Error('Command is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  const exec = shell.exec(`git ${command}`, { silent: true });

  if (exec.code !== 0) {
    const err = new Error(`'git ${command}' returned an error: ${exec.stderr}`);

    err.code = exec.code;

    return callback(err);
  }

  callback(null, exec.stdout.replace('\n', ''));
};

module.exports = git;
