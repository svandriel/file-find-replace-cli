import chalk from 'chalk';
import fs from 'fs-extra';
import globby from 'globby';

import { applyReplacement } from './apply-replacement';
import { mapConcurrently } from './map-concurrently';
import { parseReplacements, Replacement, replacementToString } from './replacement';

const DEFAULT_CONCURRENCY = 1;

export interface FindReplaceOptions {
    files: string[];
    jsonConfigFile: string;
    concurrency?: number;
    verbose?: boolean;
}

export async function findReplace(opts: FindReplaceOptions): Promise<void> {
    const { files, jsonConfigFile, concurrency = DEFAULT_CONCURRENCY, verbose = false } = opts;
    if (files.length === 0) {
        throw new Error('Must specify input files or globs');
    }

    const configJson = await fs.readJson(jsonConfigFile);
    const config = parseReplacements(configJson);

    if (verbose) {
        const configStr = config.map(item => `  ${replacementToString(item)}`).join('\n');
        console.log(`Loaded replacements from ${chalk.green(opts.jsonConfigFile)}:\n${configStr}`);
    }

    const matchedFiles = await globby(files);

    if (verbose) {
        const filesStr = files.map(str => `  ${chalk.cyan(str)}`).join('\n');
        console.log('File globs:');
        console.log(filesStr);

        const matchedFilesStr = matchedFiles.map(str => `  ${chalk.cyan(str)}`).join('\n');
        console.log('Found these files:');
        console.log(matchedFilesStr);
    }

    await mapConcurrently(concurrency, file => findReplaceFile(file, config, verbose), matchedFiles);
}

async function findReplaceFile(file: string, entries: Replacement[], verbose = false): Promise<void> {
    const buffer = await fs.readFile(file, 'utf-8');
    const contents = buffer.toString();

    if (verbose) {
        console.log(`\n${chalk.cyan(file)}:`);
    }
    const output = entries.reduce(
        (acc, entry) => {
            const { replaceCount, result } = applyReplacement(
                {
                    file,
                    verbose
                },
                entry,
                acc.result
            );
            return {
                result,
                replaceCount: acc.replaceCount + replaceCount
            };
        },
        {
            result: contents,
            replaceCount: 0
        }
    );

    await fs.writeFile(file, output.result);
    if (verbose) {
        console.log(`  Total: replaced ${chalk.bold(output.replaceCount)} occurrence(s)`);
    }
}
