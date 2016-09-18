'use strict';

const assert = require('assertthat'),
      proxyquire = require('proxyquire');

let calledCommand,
    errGit,
    resultGit;

const firstCommit = proxyquire('../../../lib/git/firstCommit', {
  './exec' (command, callback) {
    calledCommand = command;
    callback(errGit, resultGit);
  }
});

suite('firstCommit', () => {
  setup(() => {
    calledCommand = '';
    errGit = null;
    resultGit = '';
  });

  test('is a function.', done => {
    assert.that(firstCommit).is.ofType('function');
    done();
  });

  test('throws an error if callback is missing.', done => {
    assert.that(() => {
      firstCommit();
    }).is.throwing('Callback is missing.');
    done();
  });

  test('calls `git tag`.', done => {
    resultGit = 'foo';
    firstCommit((err, result) => {
      assert.that(err).is.null();
      assert.that(calledCommand).is.equalTo('rev-list --max-parents=0 HEAD');
      assert.that(result).is.equalTo(resultGit);
      done();
    });
  });

  test('returns an error if `git tag` failed.', done => {
    errGit = new Error('foo');
    firstCommit(err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });
});
