'use strict';

const assert = require('assertthat'),
      proxyquire = require('proxyquire');

let errFetch,
    errLastTag,
    resultFetch,
    resultLastTag;

const gitlogSemver = proxyquire('../../lib/gitlogSemver', {
  './git': {
    'fetch' (startTag, endTag, labels, callback) {
      callback(errFetch, resultFetch[labels]);
    },
    'lastTag' (callback) {
      callback(errLastTag, resultLastTag);
    }
  }
});

suite('gitlogSemver', () => {
  setup(() => {
    errFetch = null;
    resultFetch = {
      'major:': [],
      'minor:': [],
      'patch:': []
    };
    errLastTag = null;
    resultLastTag = '1.0.0';
  });

  test('is a function.', done => {
    assert.that(gitlogSemver).is.ofType('function');
    done();
  });

  test('throws an error if callback is missing.', done => {
    assert.that(() => {
      gitlogSemver();
    }).is.throwing('Callback is missing.');
    done();
  });

  test('returns release type `patch` if no matching commit messages exist.', done => {
    gitlogSemver((err, releaseType) => {
      assert.that(err).is.null();
      assert.that(releaseType).is.equalTo('patch');
      done();
    });
  });

  test('returns release type `patch` if only patch commit messages exist.', done => {
    resultFetch['patch:'] = [ 'message' ];
    gitlogSemver((err, releaseType, messages) => {
      assert.that(err).is.null();
      assert.that(releaseType).is.equalTo('patch');
      assert.that(messages).is.equalTo({
        major: [],
        minor: [],
        patch: [ 'message' ]
      });
      done();
    });
  });

  test('returns release type `minor` if only minor commit messages exist.', done => {
    resultFetch['minor:'] = [ 'message' ];
    gitlogSemver((err, releaseType, messages) => {
      assert.that(err).is.null();
      assert.that(releaseType).is.equalTo('minor');
      assert.that(messages).is.equalTo({
        major: [],
        minor: [ 'message' ],
        patch: []
      });
      done();
    });
  });

  test('returns release type `minor` if minor and patch commit messages exist.', done => {
    resultFetch['minor:'] = [ 'message 1' ];
    resultFetch['patch:'] = [ 'message 2' ];
    gitlogSemver((err, releaseType, messages) => {
      assert.that(err).is.null();
      assert.that(releaseType).is.equalTo('minor');
      assert.that(messages).is.equalTo({
        major: [],
        minor: [ 'message 1' ],
        patch: [ 'message 2' ]
      });
      done();
    });
  });

  test('returns release type `major` if only major commit messages exist.', done => {
    resultFetch['major:'] = [ 'message' ];
    gitlogSemver((err, releaseType, messages) => {
      assert.that(err).is.null();
      assert.that(releaseType).is.equalTo('major');
      assert.that(messages).is.equalTo({
        major: [ 'message' ],
        minor: [],
        patch: []
      });
      done();
    });
  });

  test('returns release type `major` if commit messages of all types exist.', done => {
    resultFetch['major:'] = [ 'message 1' ];
    resultFetch['minor:'] = [ 'message 2' ];
    resultFetch['patch:'] = [ 'message 3' ];
    gitlogSemver((err, releaseType, messages) => {
      assert.that(err).is.null();
      assert.that(releaseType).is.equalTo('major');
      assert.that(messages).is.equalTo({
        major: [ 'message 1' ],
        minor: [ 'message 2' ],
        patch: [ 'message 3' ]
      });
      done();
    });
  });

  test('returns release type `patch` if no tag exists yet.', done => {
    resultLastTag = null;
    gitlogSemver((err, releaseType) => {
      assert.that(err).is.null();
      assert.that(releaseType).is.equalTo('patch');
      done();
    });
  });

  test('returns an error if getting last tag failed.', done => {
    errLastTag = new Error('foo');
    gitlogSemver(err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });

  test('returns an error if fetching commit messages failed.', done => {
    errFetch = new Error('foo');
    gitlogSemver(err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });
});
