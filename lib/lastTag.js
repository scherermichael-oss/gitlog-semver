'use strict';

const git = require('./git');

const lastTag = function (callback) {
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  const command = 'describe --tags --abbrev=0';

  git(command, (err, result) => {
    if (err) {
      if (err.message === `'git ${command}' returned an error: fatal: No names found, cannot describe anything.\n`) {
        return callback(null, null);
      }

      return callback(err);
    }

    return callback(null, result.replace('\n', ''));
  });
};

module.exports = lastTag;
