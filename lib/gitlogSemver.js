'use strict';

const async = require('async');

const fetch = require('./fetch'),
      lastTag = require('./lastTag');

const gitlogSemver = function (labels, callback) {
  // labels are optional
  if (!callback) {
    callback = labels;
    labels = null;
  }

  if (!callback) {
    throw new Error('Callback is missing.');
  }

  labels = labels || {
    major: 'major:',
    minor: 'minor:',
    patch: 'patch:'
  };

  lastTag((errTag, tag) => {
    if (errTag) {
      return callback(errTag);
    }

    /* eslint-disable brace-style */
    async.parallel({
      major (done) { fetch(tag, labels.major, done); },
      minor (done) { fetch(tag, labels.minor, done); },
      patch (done) { fetch(tag, labels.patch, done); }
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
  });
};

module.exports = gitlogSemver;
