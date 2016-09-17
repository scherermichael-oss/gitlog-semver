# gitlog-semver

Identify the required [Semantic Versioning](http://sermver.org) release type based on commit messages.

## Installation

```bash
$ npm install gitlog-semver
```

## Quick start

First you need to integrate gitlog-semver into your application.

```javascript
const gitlogSemver = require('gitlog-semver');
```

### Defining the filter

Your commit log is filtered based on labels that are used to prefix the commit messages. Only commit messages newer than the most recent tag are taken into account.

First define the labels you want to filter for. Each release type (`major`, `minor`, `patch`) contains its own set of labels:

```javascript
const labels = {
  major: 'major:',
  minor: [ 'minor:', 'new:' ],
  patch: [ 'patch:', 'fix:' ]
}
```

It it not necessary to use an array for a single label (see `major` in the sample above).

### Type of next release

Now, you can use the function to retrieve the type of the next release.

```javascript
gitlogSemver(labels, (err, releaseType) => {
  if (err) {
    return console.log('Something went wrong...');
  }

  console.log(releaseType); // => 'major', 'minor' or 'patch'
});
```

It greps for commit messages that begin with any of the given labels, delimited by at least one space from the rest of the message. Here are some samples for the `labels` object defined above:

| Commit message   | Matching release type                 |
|------------------|---------------------------------------|
| `patch: Foobar`  | `patch`                               |
| `patch:Foobar`   | n/a (note the missing space)          |
| `patch:  Foobar` | `patch` (multiple spaces are allowed) |
| `Minor: Foobar`  | `minor` (match is case insensitive)   |
| `Major: All new` | `major`                               |
| `Mayor: All new` | n/a (typo in label)                   |
| `Giant: All new` | n/a (unknown label)                   |

Instead of defining your own `labels` object, you may omit the parameter.

```javascript
gitlogSemver((err, releaseType) => {
  // ...
});
```

In this case the following default labels will be used:

```javascript
const labels = {
  major: 'major:',
  minor: 'minor:',
  patch: 'patch:'
}
```

### Matching commit messages

You can also get a list of commit messages that match the given labels.

```javascript
gitlogSemver(labels, (err, releaseType, messages) => {
  if (err) {
    return console.log('Something went wrong...');
  }

  console.log(messages); // =>
    // {
    //   major: [
    //     'foo',
    //     'bar'
    //   ],
    //   minor: [
    //     'foobar'
    //   ],
    //   patch: [
    //   ]
    // }
});
```

The `messages` object contains an array with the commit messages for each release type. Only the fist line of the commit message will be included and the preceding label is already stripped off the message text. If no message has been found for a release type, the corresponding property contains an empty array.
