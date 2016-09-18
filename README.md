# gitlog-semver

Identifies the required [Semantic Versioning](http://sermver.org) release type based on commit messages.

## Installation

```bash
$ npm install gitlog-semver
```

## Quick start

First you need to integrate gitlog-semver into your application.

```javascript
const gitlogSemver = require('gitlog-semver');
```

### Type of next release

Then you can use the function to retrieve the type of the next release.

```javascript
gitlogSemver((err, releaseType) => {
  if (err) {
    return console.log('Something went wrong...');
  }

  console.log(releaseType); // => 'major', 'minor' or 'patch'
});
```

In order to determine the type of the next release, messages from commits newer than the most recent tag are filtered. Only commit messages that start with a label for the corresponding release type, delimited by at least one space from the rest of the message, are taken into account. Valid labels are `major:`, `minor:`, `patch:`. The following samples demonstrate the rules:

| Commit message   | Matching release type                 |
|------------------|---------------------------------------|
| `patch: Foobar`  | `patch`                               |
| `patch:Foobar`   | n/a (missing space)                   |
| `patch:  Foobar` | `patch` (multiple spaces are allowed) |
| `Minor: Foobar`  | `minor` (match is case insensitive)   |
| `Major: All new` | `major`                               |
| `Mayor: All new` | n/a (typo in label)                   |
| `Giant: All new` | n/a (unknown label)                   |

### Custom filter

If you want to use other labels, you can create a `filter` object. For each release type (`major`, `minor`, `patch`) define an array of labels you want to associate with.

```javascript
const filter = {
  major: [ 'major:' ],
  minor: [ 'minor:', 'new:' ],
  patch: [ 'patch:', 'fix:' ]
}
```

To use the `filter`, add the object as the first parameter of the function.

```javascript
gitlogSemver(filter, (err, releaseType) => {
  // ...
});
```

### List of commit messages

The callback provides the commit messages that match the filter, too.

```javascript
gitlogSemver((err, releaseType, messages) => {
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

The `messages` object contains an array with the commit messages for each release type. Only the first line of the commit message will be included and the preceding label is already removed from the message text.

#### Release history

If you want to also get the filtered commit messages for already released versions, set the property `limit` of the `filter` object. By setting it to `-1`, the whole commit history will be filtered.

```javascript
const filter = {
  limit: -1,
  major: 'major:',
  minor: 'minor:',
  patch: 'patch:'  
}

gitlogSemver(filter, (err, releaseType, releases) => {
  if (err) {
    return console.log('Something went wrong...');
  }

  console.log(releases); // =>
    // [{
    //   version: '1.0.0',
    //   date: '2016-09-17',
    //   messages: {
    //     major: [ 'Initial release' ],
    //     minor: [],
    //     patch: []
    //   }
    // }, {
    //   version: '1.1.0',
    //   date: '2016-09-18',
    //   messages: {
    //     major: [],
    //     minor: [ 'Some bugs fixed' ],
    //     patch: []
    //   }
    // }, {
    //   messages: {
    //     major: [ 'Breaking changes made' ],
    //     minor: [ 'Some new minor features'],
    //     patch: []
    //   }
    // }]
});
```

The returned `releases` is an array of objects. An object contains the `version` of a release (name of the tag) and its creation `date`. The `messages` property lists all matching commit messages. The last object contains only a `messages` property with the messages of all commits that are not yet released.

By setting the `limit` to a positive number, you can define the maximum length of the `releases` array.

Of course, the returned `releaseType` still provides the type of the next release.
