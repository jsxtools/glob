const glob = require('./index.js');
const pass = process.platform === 'win32' ? '√' : '✔';
const fail = process.platform === 'win32' ? '×' : '✖';

function test(source, expect, isFalse) {
	const didGlobPass = glob(source).test(expect);
	const didTestPass = (
		(didGlobPass && !isFalse) ||
		(!didGlobPass && isFalse)
	);
	const message = 'Test "' + source + '" with "' + expect + '". It should ' + (isFalse ? 'NOT match' : 'match') + '.';

	if (didTestPass) {
		console.info(message, pass);
	} else {
		console.info(message, fail);

		process.exit(1);
	}
}

/* single character matching */

test('/path/to/file?.txt', '/path/to/file1.txt');
test('/path/to/file?.txt', '/path/to/file2.txt');
test('/path/to/file?.txt', '/path/to/file3.txt');
test('/path/to/file?.txt', '/path/to/fileZ.txt');

test('/path/to/file?.txt', '/path/to/file11.txt', true);
test('/path/to/file?.txt', '/path/to/file.txt', true);

/* ranges of characters */

test('/path/to/[a-c]', '/path/to/a');
test('/path/to/[a-c]', '/path/to/b');
test('/path/to/[a-c]', '/path/to/c');

test('/path/to/[a-c]', '/path/to/d', true);
test('/path/to/[a-c]', '/path/to/e', true);

/* group matching */

test('{*.doc,*.pdf}', 'file.doc');
test('{*.doc,*.pdf}', 'file.pdf');
test('{*.doc,*.pdf}', 'file.xxx.doc');
test('{*.doc,*.pdf}', 'file.doc.xxx', true);

/* globstar patterns */

test('/path/*/index.js', '/path/to/index.js');
test('/path/*/index.js', '/path/of/index.js');

test('/path/*/index.js', '/path/to/the/index.js', true);
test('/path/*/index.js', '/path/of/the/index.js', true);
test('/path/*/index.js', '/path/index.js', true);
test('/path/*/index.js', '/index.js', true);

/* done */

console.info('\nAll tests passed!');

process.exit(0);
