'use strict';

const exec = require('./exec');

const firstCommit = function (callback) {
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  exec('rev-list --max-parents=0 HEAD', callback);
};

module.exports = firstCommit;
