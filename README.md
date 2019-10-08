# glob [<img src="https://avatars.githubusercontent.com/u/52989093" alt="" width="90" height="90" align="right">][glob]

[<img alt="npm version" src="https://img.shields.io/npm/v/@jsxtools/glob.svg" height="20">](https://www.npmjs.com/package/@jsxtools/glob)
[<img alt="build status" src="https://img.shields.io/travis/jsxtools/glob/master.svg" height="20">](https://travis-ci.org/jsxtools/glob)
[<img alt="issue tracker" src="https://img.shields.io/github/issues/jsxtools/glob.svg" height="20">](https://github.com/jsxtools/glob/issues)
[<img alt="pull requests" src="https://img.shields.io/github/issues-pr/jsxtools/glob.svg" height="20">](https://github.com/jsxtools/glob/pulls)

**glob** lets you convert glob patterns into regular expressions.
It has no dependencies and is 1120 bytes, or 471 bytes gzipped.
It works in all browsers and all versions of Node.

**glob** is a code-golfing fork of the amazing [globrex].

## Usage

Add **glob** to your project:

```sh
npm install @jsxtools/glob
```

Use **glob** to convert glob patterns into regular expressions:

```js
glob = require('@jsxtools/glob')

// match JS files either within "path/to/" or a subdirectory of "path/to/"
match1 = glob('path/to/{*,*/*}.js')

// these paths will match
match1.test('path/to/file.js')
match1.test('path/to/lib/file.js')

// these paths will NOT match
match1.test('path/to/file.js.map')
match1.test('path/to/lib/deeper/file.js')
match1.test('path/to/file.js/lib')

// match paths that start with "p" followed by any letter followed by "ck"
match2 = glob('p[a-z]ck')

// these will match
match2.test('pack')
match2.test('puck')

// these will NOT match
match2.test('pck')
match2.test('pluck')
match2.test('p-ck')
```

**glob** supports single character matching.

```js
glob('/path/to/file?.txt').test('/path/to/file1.txt') // true
glob('/path/to/file?.txt').test('/path/to/file2.txt') // true
glob('/path/to/file?.txt').test('/path/to/file3.txt') // true
glob('/path/to/file?.txt').test('/path/to/fileZ.txt') // true

glob('/path/to/file?.txt').test('/path/to/file11.txt') // FALSE
glob('/path/to/file?.txt').test('/path/to/file.txt') // FALSE
```

**glob** supports matching ranges of characters.

```js
glob('/path/to/[a-c]').test('/path/to/a') // true
glob('/path/to/[a-c]').test('/path/to/b') // true
glob('/path/to/[a-c]').test('/path/to/c') // true

glob('/path/to/[a-c]').test('/path/to/d') // FALSE
glob('/path/to/[a-c]').test('/path/to/e') // FALSE
```

**glob** supports group matching.

```js
glob('{*.doc,*.pdf}').test('file.doc') // true
glob('{*.doc,*.pdf}').test('file.pdf') // true
glob('{*.doc,*.pdf}').test('file.xxx.pdf') // true

glob('{*.doc,*.pdf}').test('file.pdf.xxx') // FALSE
```

**glob** supports globstar patterns.

```js
glob('/path/*/index.js').test('/path/to/index.js') // true
glob('/path/*/index.js').test('/path/of/index.js') // true

glob('/path/*/index.js').test('/path/to/the/index.js') // FALSE
glob('/path/*/index.js').test('/path/of/the/index.js') // FALSE
glob('/path/*/index.js').test('/path/index.js') // FALSE
glob('/path/*/index.js').test('/index.js') // FALSE
```

**glob** supports posix-style paths and does not support windows-style paths.

I recommend you detect the windows environment and manage this conversion yourself:

```js
// whether the environment is windows
const isWin = process.platform === 'win32'

// returns a windows-style path converted into a posix-style path
const win2pos = win32path => win32path.replace(/^(\w+):|\\/g, '/$1')

// returns any path conditionally converted into a posix-style path
const all2pos = anypath => isWin ? win2pos(anypath) : anypath

// becomes "/Users/THX1138/images/../files"
all2pos('/Users/THX1138/images/../files')

// becomes "/C/Users/THX1138/images/../files"
all2pos('C:\\Users\\THX1138\\images\\..\\files')
```

[glob]: https://github.com/jsxtools/glob
[globrex]: https://github.com/terkelg/globrex
