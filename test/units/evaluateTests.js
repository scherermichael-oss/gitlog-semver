'use strict';

const assert = require('assertthat'),
      proxyquire = require('proxyquire');

let errFetch,
    resultFetch;

const evaluate = proxyquire('../../lib/evaluate', {
  './git': {
    fetch (startTag, endTag, labels, callback) {
      callback(errFetch, resultFetch[labels]);
    }
  }
});

suite('evaluate', () => {
  setup(() => {
    errFetch = null;
    resultFetch = {
      'major:': [],
      'minor:': [],
      'patch:': []
    };
  });

  test('is a function.', done => {
    assert.that(evaluate).is.ofType('function');
    done();
  });

  test('throws an error if type is missing.', done => {
    assert.that(() => {
      evaluate('startTag', 'endTag');
    }).is.throwing('Filter is missing.');
    done();
  });

  test('throws an error if callback is missing.', done => {
    assert.that(() => {
      evaluate('startTag', 'endTag', {
        major: 'major:',
        minor: 'minor:',
        patch: 'patch:'
      });
    }).is.throwing('Callback is missing.');
    done();
  });

  test('returns release type `patch` if no matching commit messages exist.', done => {
    evaluate('startTag', 'endTag', {
      major: 'major:',
      minor: 'minor:',
      patch: 'patch:'
    }, (err, releaseType) => {
      assert.that(err).is.null();
      assert.that(releaseType).is.equalTo('patch');
      done();
    });
  });

  test('returns release type `patch` if only patch commit messages exist.', done => {
    resultFetch['patch:'] = [ 'message' ];
    evaluate('startTag', 'endTag', {
      major: 'major:',
      minor: 'minor:',
      patch: 'patch:'
    }, (err, releaseType, messages) => {
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
    evaluate('startTag', 'endTag', {
      major: 'major:',
      minor: 'minor:',
      patch: 'patch:'
    }, (err, releaseType, messages) => {
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
    evaluate('startTag', 'endTag', {
      major: 'major:',
      minor: 'minor:',
      patch: 'patch:'
    }, (err, releaseType, messages) => {
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
    evaluate('startTag', 'endTag', {
      major: 'major:',
      minor: 'minor:',
      patch: 'patch:'
    }, (err, releaseType, messages) => {
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
    evaluate('startTag', 'endTag', {
      major: 'major:',
      minor: 'minor:',
      patch: 'patch:'
    }, (err, releaseType, messages) => {
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

  test('returns an error if fetching commit messages failed.', done => {
    errFetch = new Error('foo');
    evaluate('startTag', 'endTag', {
      major: 'major:',
      minor: 'minor:',
      patch: 'patch:'
    }, err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });
});
