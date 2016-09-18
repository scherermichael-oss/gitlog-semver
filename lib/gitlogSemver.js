'use strict';

const async = require('async');

const fetch = require('./fetch'),
      lastTag = require('./lastTag');

const gitlogSemver = function (filter, callback) {
  // filter is optional
  if (!callback) {
    callback = filter;
    filter = null;
  }

  if (!callback) {
    throw new Error('Callback is missing.');
  }

  filter = filter || {
    major: 'major:',
    minor: 'minor:',
    patch: 'patch:'
  };

  lastTag((errTag, startTag) => {
    if (errTag) {
      return callback(errTag);
    }

    const endTag = 'HEAD';

    /* eslint-disable brace-style */
    async.parallel({
      major (done) { fetch(startTag, endTag, filter.major, done); },
      minor (done) { fetch(startTag, endTag, filter.minor, done); },
      patch (done) { fetch(startTag, endTag, filter.patch, done); }
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
