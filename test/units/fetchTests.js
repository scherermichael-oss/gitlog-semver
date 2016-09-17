'use strict';

const assert = require('assertthat'),
      proxyquire = require('proxyquire');

let calledCommand,
    errGit,
    resultGit;

const fetch = proxyquire('../../lib/fetch', {
  './git' (command, callback) {
    calledCommand = command;
    callback(errGit, resultGit);
  }
});

suite('fetch', () => {
  setup(() => {
    calledCommand = '';
    errGit = null;
    resultGit = '';
  });

  test('is a function.', done => {
    assert.that(fetch).is.ofType('function');
    done();
  });

  test('throws an error if labels are missing.', done => {
    assert.that(() => {
      fetch('startTag');
    }).is.throwing('Labels are missing.');
    done();
  });

  test('throws an error if callback is missing.', done => {
    assert.that(() => {
      fetch('startTag', []);
    }).is.throwing('Callback is missing.');
    done();
  });

  test('calls `git log`.', done => {
    resultGit = 'line1\nline2\n';
    fetch('startTag', [ 'label' ], (err, result) => {
      assert.that(err).is.null();
      assert.that(calledCommand).is.equalTo('log startTag..HEAD --oneline --grep "^(label) +" -E -i --pretty=format:%s');
      assert.that(result).is.equalTo([
        'line1',
        'line2'
      ]);
      done();
    });
  });

  test('handles single label as string instead of an array.', done => {
    fetch('startTag', 'label', err => {
      assert.that(err).is.null();
      assert.that(calledCommand).is.equalTo('log startTag..HEAD --oneline --grep "^(label) +" -E -i --pretty=format:%s');
      done();
    });
  });

  test('does not set commit range if no last tag exists.', done => {
    fetch(null, 'label', err => {
      assert.that(err).is.null();
      assert.that(calledCommand).is.equalTo('log  --oneline --grep "^(label) +" -E -i --pretty=format:%s');
      done();
    });
  });

  test('ignores empty lines in stdout.', done => {
    resultGit = 'line1\n\n';
    fetch('startTag', [ 'label' ], (err, result) => {
      assert.that(err).is.null();
      assert.that(result).is.equalTo([
        'line1'
      ]);
      done();
    });
  });

  test('returns an error if `git log` failed.', done => {
    errGit = new Error('foo');
    fetch('startTag', [ 'label' ], err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });
});
