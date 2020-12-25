import chalk from 'chalk';
import { applyReplacement } from './apply-replacement';

describe('applyReplacement', () => {
    it('replaces all occurrences in content', () => {
        expect(
            applyReplacement(
                {
                    file: 'test-filename.txt',
                    verbose: false
                },
                {
                    find: 'in',
                    replace: 'out',
                    wholeWord: false,
                    ignoreCase: false
                },
                'Test IN one two in integration determination In SINgle'
            )
        ).toEqual({
            replaceCount: 3,
            result: 'Test IN one two out outtegration determoutation In SINgle'
        });
    });

    it('matches whole words', () => {
        expect(
            applyReplacement(
                {
                    file: 'test-filename.txt',
                    verbose: false
                },
                {
                    find: 'in',
                    replace: 'out',
                    wholeWord: true,
                    ignoreCase: false
                },
                'Ut sodales nunc non velit blandit, in dignissim nulla interdum.'
            )
        ).toEqual({
            replaceCount: 1,
            result: 'Ut sodales nunc non velit blandit, out dignissim nulla interdum.'
        });
    });

    it('matches whole words ignoring case', () => {
        expect(
            applyReplacement(
                {
                    file: 'test-filename.txt',
                    verbose: false
                },
                {
                    find: 'in',
                    replace: 'out',
                    wholeWord: true,
                    ignoreCase: true
                },
                'Test IN one two in integration determination In SINgle'
            )
        ).toEqual({
            replaceCount: 3,
            result: 'Test out one two out integration determination out SINgle'
        });
    });

    it('is verbose', () => {
        jest.spyOn(console, 'log').mockImplementation(jest.fn());
        expect(
            applyReplacement(
                {
                    file: 'test-filename.txt',
                    verbose: true
                },
                {
                    find: 'in',
                    replace: 'out',
                    wholeWord: false,
                    ignoreCase: false
                },
                'Test IN one two\nin integration\ndetermination\n In SINgle'
            )
        ).toEqual({
            replaceCount: 3,
            result: 'Test IN one two\nout outtegration\ndetermoutation\n In SINgle'
        });

        expect(console.log).toHaveBeenCalledTimes(3);
        expect(console.log).toHaveBeenCalledWith(
            `${chalk.cyan('test-filename.txt')}:2:1: ${chalk.green('in')} => ${chalk.yellow('out')}`
        );
        expect(console.log).toHaveBeenCalledWith(
            `${chalk.cyan('test-filename.txt')}:2:4: ${chalk.green('in')} => ${chalk.yellow('out')}`
        );
        expect(console.log).toHaveBeenCalledWith(
            `${chalk.cyan('test-filename.txt')}:3:7: ${chalk.green('in')} => ${chalk.yellow('out')}`
        );
    });
});
