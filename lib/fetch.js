'use strict';

const git = require('./git');

const fetch = function (startTag, labels, callback) {
  if (!labels) {
    throw new Error('Labels are missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  if (!(labels instanceof Array)) {
    labels = [ labels ];
  }

  const filter = `^(${labels.join('|')}) +`;
  const commitRange = startTag ? `${startTag}..HEAD` : '';

  git(`log ${commitRange} --oneline --grep "${filter}" -E -i --pretty=format:%s`, (err, stdout) => {
    if (err) {
      return callback(err);
    }

    const lines = stdout.split('\n');
    const result = [];

    // Remove labels from start of commit message, ignore empty lines
    lines.forEach(line => {
      if (line.length > 0) {
        result.push(line.replace(/$filter/, ''));
      }
    });

    callback(null, result);
  });
};

module.exports = fetch;
