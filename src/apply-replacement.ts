import chalk from 'chalk';
import escapeStringRegexp from 'escape-string-regexp';

import { computeLineOffsets, findOffset } from './line-offsets';
import { Replacement } from './replacement';

export interface ApplyReplacementOptions {
    file: string;
    verbose?: boolean;
}

export function applyReplacement(
    options: ApplyReplacementOptions,
    entry: Replacement,
    content: string
): { result: string; replaceCount: number } {
    const { file, verbose = false } = options;
    const ignoreCaseFlag = entry.ignoreCase ? 'i' : '';
    const flags = `g${ignoreCaseFlag}`;
    const escapedFindText = escapeStringRegexp(entry.find);
    const regexText = entry.wholeWord ? `\\b${escapedFindText}\\b` : escapedFindText;
    const regexp = new RegExp(regexText, flags);
    let replaceCount = 0;
    const result = content.replace(regexp, (match, index) => {
        if (verbose) {
            const lineOffsets = computeLineOffsets(content);
            const position = findOffset(lineOffsets, index);
            console.log(
                `  At ${chalk.gray(file)}:${position.lineIndex + 1}:${position.columnIndex + 1}: ${chalk.green(
                    match
                )} => ${chalk.yellow(entry.replace)}`
            );
        }
        replaceCount += 1;
        return entry.replace;
    });
    if (verbose) {
        console.log(`  -> replaced ${chalk.bold(replaceCount)} occurrence(s) of ${chalk.cyan(entry.find)}`);
    }
    return {
        replaceCount,
        result
    };
}
