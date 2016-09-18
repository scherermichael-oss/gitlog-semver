'use strict';

const exec = require('./exec');

const dateOfTag = function (tag, callback) {
  if (!tag) {
    throw new Error('Tag is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  exec(`log -1 --date=short --format=%ad ${tag}`, (err, result) => {
    if (err) {
      return callback(err);
    }

    return callback(null, result.replace('\n', ''));
  });
};

module.exports = dateOfTag;
