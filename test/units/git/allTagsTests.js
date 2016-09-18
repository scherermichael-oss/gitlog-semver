'use strict';

const assert = require('assertthat'),
      proxyquire = require('proxyquire');

let calledCommand,
    errGit,
    resultGit;

const allTags = proxyquire('../../../lib/git/allTags', {
  './exec' (command, callback) {
    calledCommand = command;
    callback(errGit, resultGit);
  }
});

suite('allTags', () => {
  setup(() => {
    calledCommand = '';
    errGit = null;
    resultGit = '';
  });

  test('is a function.', done => {
    assert.that(allTags).is.ofType('function');
    done();
  });

  test('throws an error if callback is missing.', done => {
    assert.that(() => {
      allTags();
    }).is.throwing('Callback is missing.');
    done();
  });

  test('calls `git tag`.', done => {
    resultGit = 'tag1\ntag2';
    allTags((err, result) => {
      assert.that(err).is.null();
      assert.that(calledCommand).is.equalTo('tag');
      assert.that(result).is.equalTo([
        'tag1',
        'tag2'
      ]);
      done();
    });
  });

  test('returns an error if `git tag` failed.', done => {
    errGit = new Error('foo');
    allTags(err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });
});
