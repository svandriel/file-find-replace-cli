import chalk from 'chalk';
import escapeStringRegexp from 'escape-string-regexp';
import fs from 'fs-extra';
import globby from 'globby';
import { computeLineOffsets, findOffset } from './line-offsets';

import { mapConcurrently } from './map-concurrently';
import { parseReplacements, Replacement } from './replacement';

const DEFAULT_CONCURRENCY = 10;

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

    const configJson = await readJson(jsonConfigFile);
    const config = parseReplacements(configJson);

    if (verbose) {
        const configStr = config.map(item => `  ${chalk.bold(item.find)} => ${chalk.bold(item.replace)}`).join('\n');
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

async function findReplaceFile(file: string, entries: Replacement[], verbose?: boolean): Promise<void> {
    const buffer = await fs.readFile(file, 'utf-8');
    const contents = buffer.toString();

    const lineStartIndices = computeLineOffsets(contents);

    const output = entries.reduce(
        (acc, entry) => {
            const ignoreCaseFlag = entry.ignoreCase ? 'i' : '';
            const flags = `g${ignoreCaseFlag}`;
            const regexp = new RegExp(escapeStringRegexp(entry.find), flags);
            let replaceCount = acc.replaceCount;
            const result = acc.result.replace(regexp, (match, index) => {
                if (verbose) {
                    const position = findOffset(lineStartIndices, index);
                    console.log(
                        `At ${chalk.cyan(file)}:${position.lineIndex + 1}:${
                            position.columnIndex + 1
                        }: replacing ${chalk.green(match)} with ${chalk.yellow(entry.replace)}`
                    );
                }
                replaceCount += 1;
                return entry.replace;
            });

            return { result, replaceCount };
        },
        {
            result: contents,
            replaceCount: 0
        }
    );

    await fs.writeFile(file, output.result);
    if (verbose) {
        console.log(`Found ${chalk.bold(output.replaceCount)} replacements in ${chalk.cyan(file)}`);
    }
}

async function readJson<T>(file: string): Promise<T> {
    const buffer = await fs.readFile(file, 'utf-8');

    return JSON.parse(buffer.toString());
}
