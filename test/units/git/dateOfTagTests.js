'use strict';

const assert = require('assertthat'),
      proxyquire = require('proxyquire');

let calledCommand,
    errGit,
    resultGit;

const dateOfTag = proxyquire('../../../lib/git/dateOfTag', {
  './exec' (command, callback) {
    calledCommand = command;
    callback(errGit, resultGit);
  }
});

suite('dateOfTag', () => {
  setup(() => {
    calledCommand = '';
    errGit = null;
    resultGit = '';
  });

  test('is a function.', done => {
    assert.that(dateOfTag).is.ofType('function');
    done();
  });

  test('throws an error if callback is missing.', done => {
    assert.that(() => {
      dateOfTag('tag');
    }).is.throwing('Callback is missing.');
    done();
  });

  test('calls `git tag`.', done => {
    resultGit = '2016-09-18';
    dateOfTag('tag', (err, result) => {
      assert.that(err).is.null();
      assert.that(calledCommand).is.equalTo('log -1 --date=short --format=%ad tag');
      assert.that(result).is.equalTo(resultGit);
      done();
    });
  });

  test('returns an error if `git tag` failed.', done => {
    errGit = new Error('foo');
    dateOfTag('tag', err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });

  test('returns undefined if tag is missing.', done => {
    dateOfTag(null, (err, result) => {
      assert.that(err).is.null();
      assert.that(result).is.undefined();
      done();
    });
  });
});
