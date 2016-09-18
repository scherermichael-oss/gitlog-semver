'use strict';

const async = require('async');

const evaluate = require('./evaluate'),
      git = require('./git');

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
    major: [ 'major:' ],
    minor: [ 'minor:' ],
    patch: [ 'patch:' ]
  };

  filter.limit = filter.limit || 1;

  const result = [];
  let releaseType = 'patch';

  git.allTags((errTags, tags) => {
    if (errTags) {
      return callback(errTags);
    }

    git.firstCommit((errCommit, commit) => {
      if (errCommit) {
        return callback(errCommit);
      }

      // Fetch commit messages from first commit and apply limit
      tags = [ commit ].concat(tags);
      tags = filter.limit > 0 ? tags.slice(-filter.limit) : tags;

      async.eachOf(tags, (startTag, index, done) => {
        const endTag = tags[index + 1];

        git.dateOfTag(endTag, (errDate, date) => {
          if (errDate) {
            return done(errDate);
          }

          evaluate(startTag, endTag, filter, (errEvaluate, tagReleaseType, messages) => {
            if (errEvaluate) {
              return done(errEvaluate);
            }

            result.push({
              version: endTag,
              date,
              messages
            });
            releaseType = tagReleaseType;

            done(null);
          });
        });
      }, errEach => {
        callback(errEach, releaseType, result.length === 1 ? result[0] : result);
      });
    });
  });
};

module.exports = gitlogSemver;
