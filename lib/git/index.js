'use strict';

const allTags = require('./allTags'),
      dateOfTag = require('./dateOfTag'),
      fetch = require('./fetch'),
      firstCommit = require('./firstCommit'),
      lastTag = require('./lastTag');

const git = {
  allTags,
  dateOfTag,
  fetch,
  firstCommit,
  lastTag
};

module.exports = git;
