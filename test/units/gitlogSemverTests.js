'use strict';

const assert = require('assertthat'),
      proxyquire = require('proxyquire');

let allTags = {},
    dateOfTag = {},
    evaluate = {},
    firstCommit = {};

const gitlogSemver = proxyquire('../../lib/gitlogSemver', {
  './evaluate' (startTag, endTag, filter, callback) {
    evaluate.input = {
      endTag,
      filter,
      startTag
    };
    callback(evaluate.err, evaluate.result.releaseType, evaluate.result.messages);
  },
  './git': {
    allTags (callback) {
      callback(allTags.err, allTags.result);
    },
    dateOfTag (tag, callback) {
      evaluate.input = {
        tag
      };
      callback(dateOfTag.err, dateOfTag.result);
    },
    firstCommit (callback) {
      callback(firstCommit.err, firstCommit.result);
    }
  }
});

suite('gitlogSemver', () => {
  setup(() => {
    allTags = {
      err: null,
      result: [ 'tag1', 'tag2' ]
    };
    dateOfTag = {
      err: null,
      result: undefined
    };
    evaluate = {
      err: null,
      result: {
        releaseType: 'patch',
        messages: { major: [], minor: [], patch: []}
      }
    };
    firstCommit = {
      err: null,
      result: 'firstCommit'
    };
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

  test('returns the evaluated release type.', done => {
    evaluate.result.releaseType = 'foo';
    gitlogSemver((err, releaseType) => {
      assert.that(err).is.null();
      assert.that(releaseType).is.equalTo('foo');
      done();
    });
  });

  test('returns the evaluated commit messages.', done => {
    evaluate.result.messages = {
      foo: [ 'bar' ]
    };
    gitlogSemver((err, releaseType, messages) => {
      assert.that(err).is.null();
      assert.that(messages).is.equalTo([{
        version: undefined,
        date: undefined,
        messages: {
          foo: [ 'bar' ]
        }
      }]);
      done();
    });
  });

  test('evaluates the given filter.', done => {
    const filter = {
      foo: 'bar'
    };

    gitlogSemver(filter, err => {
      assert.that(err).is.null();
      assert.that(evaluate.input.filter).is.equalTo(filter);
      done();
    });
  });

  test('returns an error if getting getting all tags failed.', done => {
    allTags.err = new Error('foo');
    gitlogSemver(err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });

  test('returns an error if getting getting the first commit failed.', done => {
    firstCommit.err = new Error('foo');
    gitlogSemver(err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });

  test('returns an error if getting getting date of tag failed.', done => {
    dateOfTag.err = new Error('foo');
    gitlogSemver(err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });

  test('returns an error if evaluation failed.', done => {
    evaluate.err = new Error('foo');
    gitlogSemver(err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });
});
