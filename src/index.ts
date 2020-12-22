import chalk from 'chalk';
import fs from 'fs-extra';
import globby from 'globby';

import { findReplaceInFile } from './find-replace-in-file';
import { mapConcurrently } from './map-concurrently';
import { parseReplacements, replacementToString } from './replacement';
import { FindReplaceOptions, FindReplaceResult } from './types';

const DEFAULT_CONCURRENCY = 1;

export async function findReplace(opts: FindReplaceOptions): Promise<FindReplaceResult[]> {
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

    return mapConcurrently(concurrency, file => findReplaceInFile(file, config, verbose), matchedFiles);
}
