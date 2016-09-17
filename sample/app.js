'use strict';

/* eslint-disable no-console */

const gitlogSemver = require('../lib/gitlogSemver');

gitlogSemver((err, releaseType, messages) => {
  if (err) {
    return console.log('Error:', err);
  }

  console.log('Commit messages:', messages);
  console.log('Release type:', releaseType);
});
