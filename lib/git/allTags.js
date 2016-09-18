'use strict';

const exec = require('./exec');

const allTags = function (callback) {
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  exec('tag', (err, result) => {
    if (err) {
      return callback(err);
    }

    if (result === '') {
      return callback(null, []);
    }

    return callback(null, result.split('\n'));
  });
};

module.exports = allTags;
