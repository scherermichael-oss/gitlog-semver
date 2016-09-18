'use strict';

const allTags = require('./allTags'),
      dateOfTag = require('./dateOfTag'),
      fetch = require('./fetch'),
      firstCommit = require('./firstCommit');

const git = {
  allTags,
  dateOfTag,
  fetch,
  firstCommit
};

module.exports = git;
