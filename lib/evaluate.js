'use strict';

const async = require('async');

const git = require('./git');

const evaluate = function (startTag, endTag, filter, callback) {
  if (!filter) {
    throw new Error('Filter is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  /* eslint-disable brace-style */
  async.parallel({
    major (done) { git.fetch(startTag, endTag, filter.major, done); },
    minor (done) { git.fetch(startTag, endTag, filter.minor, done); },
    patch (done) { git.fetch(startTag, endTag, filter.patch, done); }
  }, (errFetch, messages) => {
    if (errFetch) {
      return callback(errFetch);
    }

    let releaseType = 'patch';

    if (messages.minor.length > 0) {
      releaseType = 'minor';
    }

    if (messages.major.length > 0) {
      releaseType = 'major';
    }

    callback(null, releaseType, messages);
  });
  /* eslint-enable brace-style */
};

module.exports = evaluate;
