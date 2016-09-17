'use strict';

const assert = require('assertthat'),
      proxyquire = require('proxyquire');

let calledCommand,
    execResult;

const git = proxyquire('../../lib/git', {
  shelljs: {
    exec (command) {
      calledCommand = command;

      return execResult;
    }
  }
});

suite('git', () => {
  setup(() => {
    calledCommand = '';
    execResult = {
      code: 0,
      stdout: 'stdout',
      stderr: 'stderr'
    };
  });

  test('is a function.', done => {
    assert.that(git).is.ofType('function');
    done();
  });

  test('throws an error if command is missing.', done => {
    assert.that(() => {
      git();
    }).is.throwing('Command is missing.');
    done();
  });

  test('throws an error if callback is missing.', done => {
    assert.that(() => {
      git('foo');
    }).is.throwing('Callback is missing.');
    done();
  });

  test('calls the git command.', done => {
    git('foo', () => {
      assert.that(calledCommand).is.equalTo('git foo');
      done();
    });
  });

  test('returns the stdout.', done => {
    git('foo', (err, stdout) => {
      assert.that(err).is.null();
      assert.that(stdout).is.equalTo('stdout');
      done();
    });
  });

  test('returns an error if git failed.', done => {
    execResult.code = 1;
    git('foo', err => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('\'git foo\' returned an error: stderr');
      done();
    });
  });
});
