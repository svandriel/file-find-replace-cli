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
    replacement: Replacement,
    content: string
): { result: string; replaceCount: number } {
    const { file, verbose = false } = options;
    const regexp = regexFromReplacement(replacement);
    let replaceCount = 0;
    const result = content.replace(regexp, (match, index) => {
        if (verbose) {
            const lineOffsets = computeLineOffsets(content);
            const position = findOffset(lineOffsets, index);
            console.log(
                `${chalk.cyan(file)}:${position.lineIndex + 1}:${position.columnIndex + 1}: ${chalk.green(
                    match
                )} => ${chalk.yellow(replacement.replace)}`
            );
        }
        replaceCount += 1;
        return replacement.replace;
    });
    return {
        replaceCount,
        result
    };
}

function regexFromReplacement(replacement: Replacement): RegExp {
    const ignoreCaseFlag = replacement.ignoreCase ? 'i' : '';
    const flags = `g${ignoreCaseFlag}`;
    const escapedFindText = escapeStringRegexp(replacement.find);
    const regexText = replacement.wholeWord ? `\\b${escapedFindText}\\b` : escapedFindText;
    const regexp = new RegExp(regexText, flags);
    return regexp;
}
