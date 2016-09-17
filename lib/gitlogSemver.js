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
    patch: 'patch:',
    minor: 'minor:',
    major: 'major:'
  };

  lastTag((errTag, tag) => {
    if (errTag) {
      return callback(errTag);
    }

    /* eslint-disable brace-style */
    async.parallel({
      patch (done) { fetch(tag, labels.patch, done); },
      minor (done) { fetch(tag, labels.minor, done); },
      major (done) { fetch(tag, labels.major, done); }
    }, (errFetch, messages) => {
      if (errFetch) {
        return callback(errFetch);
      }

      let releaseType = 'patch';

      [ 'minor', 'major' ].forEach(type => {
        if (messages[type].length > 0) {
          releaseType = type;
        }
      });

      callback(null, releaseType, messages);
    });
  });
};

module.exports = gitlogSemver;
