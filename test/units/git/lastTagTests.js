'use strict';

const assert = require('assertthat'),
      proxyquire = require('proxyquire');

let calledCommand,
    errGit,
    resultGit;

const lastTag = proxyquire('../../../lib/git/lastTag', {
  './exec' (command, callback) {
    calledCommand = command;
    callback(errGit, resultGit);
  }
});

suite('lastTag', () => {
  setup(() => {
    calledCommand = '';
    errGit = null;
    resultGit = '';
  });

  test('is a function.', done => {
    assert.that(lastTag).is.ofType('function');
    done();
  });

  test('throws an error if callback is missing.', done => {
    assert.that(() => {
      lastTag();
    }).is.throwing('Callback is missing.');
    done();
  });

  test('calls `git describe`.', done => {
    resultGit = 'foo';
    lastTag((err, result) => {
      assert.that(err).is.null();
      assert.that(calledCommand).is.equalTo('describe --tags --abbrev=0');
      assert.that(result).is.equalTo(resultGit);
      done();
    });
  });

  test('returns an error if `git describe` failed.', done => {
    errGit = new Error('foo');
    lastTag(err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });

  test('returns `null` as tag instead of throwing an error if no tag exists.', done => {
    errGit = new Error('\'git describe --tags --abbrev=0\' returned an error: fatal: No names found, cannot describe anything.\n');
    lastTag((err, result) => {
      assert.that(err).is.null();
      assert.that(result).is.null();
      done();
    });
  });
});
