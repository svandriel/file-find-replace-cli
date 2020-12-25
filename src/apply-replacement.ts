import chalk from 'chalk';

import { computeLineOffsets, findOffset } from './line-offsets';
import { regexFromReplacement, Replacement } from './replacement';

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
