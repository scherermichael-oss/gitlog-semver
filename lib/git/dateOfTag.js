'use strict';

const exec = require('./exec');

const dateOfTag = function (tag, callback) {
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  if (!tag) {
    return callback(null, undefined);
  }

  exec(`log -1 --date=short --format=%ad ${tag}`, callback);
};

module.exports = dateOfTag;
