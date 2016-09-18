'use strict';

const exec = require('./exec');

const allTags = function (callback) {
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  const command = 'describe --tags --abbrev=0';

  exec(command, (err, result) => {
    if (err) {
      // No tag found, return null
      if (err.message === `'git ${command}' returned an error: fatal: No names found, cannot describe anything.\n`) {
        return callback(null, null);
      }

      return callback(err);
    }

    return callback(null, result.replace('\n', ''));
  });
};

module.exports = allTags;
