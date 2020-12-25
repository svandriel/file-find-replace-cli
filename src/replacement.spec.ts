import chalk from 'chalk';
import { parseReplacements, regexFromReplacement, replacementToString } from './replacement';

describe('parseReplacements', () => {
    it('parses an empty array', () => {
        expect(parseReplacements([])).toEqual([]);
    });

    it('parses a single object', () => {
        expect(parseReplacements({ find: 'x', replace: 'y' })).toEqual([
            {
                find: 'x',
                replace: 'y',
                ignoreCase: false,
                wholeWord: false
            }
        ]);
    });

    it('parses an array of objects', () => {
        expect(
            parseReplacements([
                { find: 'x', replace: 'y' },
                { find: 'one', replace: 'two', ignoreCase: true },
                { find: 'four', replace: 'FIVE', ignoreCase: true, wholeWord: true },
                { find: 'SIX', replace: 'seven', ignoreCase: false, wholeWord: true, extra: 'EXTRA' }
            ])
        ).toEqual([
            {
                find: 'x',
                replace: 'y',
                ignoreCase: false,
                wholeWord: false
            },
            {
                find: 'one',
                ignoreCase: true,
                replace: 'two',
                wholeWord: false
            },
            {
                find: 'four',
                ignoreCase: true,
                replace: 'FIVE',
                wholeWord: true
            },
            {
                find: 'SIX',
                ignoreCase: false,
                replace: 'seven',
                wholeWord: true
            }
        ]);
    });

    it('throws error when passed something wrong', () => {
        expect(() => parseReplacements('hi')).toThrowError('Expected entry to be object, found string');
        expect(() => parseReplacements(undefined)).toThrowError("Expected entry ot be non-falsy, found 'undefined'");
        expect(() => parseReplacements(null)).toThrowError("Expected entry ot be non-falsy, found 'null'");
        expect(() => parseReplacements(100)).toThrowError('Expected entry to be object, found number');
        expect(() => parseReplacements([undefined])).toThrowError("Expected entry ot be non-falsy, found 'undefined'");
    });
});

describe('replacementToString', () => {
    it('works for a trivial case', () => {
        expect(
            replacementToString({
                find: 'a',
                replace: 'b',
                ignoreCase: false,
                wholeWord: false
            })
        ).toBe(`${chalk.bold('a')} => ${chalk.bold('b')}`);
    });

    it('adds qualifiers for the flags', () => {
        expect(
            replacementToString({
                find: 'a',
                replace: 'b',
                ignoreCase: true,
                wholeWord: false
            })
        ).toBe(`${chalk.bold('a')} => ${chalk.bold('b')}${chalk.gray(' [ignoreCase]')}`);

        expect(
            replacementToString({
                find: 'a',
                replace: 'b',
                ignoreCase: false,
                wholeWord: true
            })
        ).toBe(`${chalk.bold('a')} => ${chalk.bold('b')}${chalk.gray(' [wholeWord]')}`);

        expect(
            replacementToString({
                find: 'a',
                replace: 'b',
                ignoreCase: true,
                wholeWord: true
            })
        ).toBe(`${chalk.bold('a')} => ${chalk.bold('b')}${chalk.gray(' [wholeWord]')}${chalk.gray(' [ignoreCase]')}`);
    });
});

describe('regexFromReplacement', () => {
    it('works for a trivial case', () => {
        expect(
            regexFromReplacement({
                find: 'a',
                replace: 'b',
                wholeWord: false,
                ignoreCase: false
            })
        ).toEqual(/a/g);
    });

    it('wraps the regex in \\b when wholeWord is on', () => {
        expect(
            regexFromReplacement({
                find: 'a',
                replace: 'b',
                wholeWord: true,
                ignoreCase: false
            })
        ).toEqual(/\ba\b/g);
    });

    it('adds an i flag when ignoreCase is of', () => {
        expect(
            regexFromReplacement({
                find: 'a',
                replace: 'b',
                wholeWord: false,
                ignoreCase: true
            })
        ).toEqual(/a/gi);
    });

    it('escapes regex characters and sets flags', () => {
        expect(
            regexFromReplacement({
                find: 'some (tricky) expression? [a]',
                replace: 'b',
                wholeWord: true,
                ignoreCase: true
            })
        ).toEqual(/\bsome \(tricky\) expression\? \[a\]\b/gi);
    });
});
