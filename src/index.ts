import fs from 'fs-extra';
import globby from 'globby';
import { mapConcurrently } from './map-concurrently';
import { parseReplacements, Replacement } from './replacements';
import escapeStringRegexp from 'escape-string-regexp';

const DEFAULT_CONCURRENCY = 10;

export interface FindReplaceOptions {
    files: string[];
    jsonConfigFile: string;
    concurrency?: number;
}

export async function findReplace(opts: FindReplaceOptions): Promise<void> {
    const { files, jsonConfigFile, concurrency = DEFAULT_CONCURRENCY } = opts;
    if (files.length === 0) {
        throw new Error('Must specify input files or globs');
    }

    const configJson = await readJson(jsonConfigFile);
    const config = parseReplacements(configJson);

    const matchedFiles = await globby(files);

    mapConcurrently(concurrency, file => findReplaceFile(file, config), matchedFiles);

    console.log({ matchedFiles, config });
}

async function findReplaceFile(file: string, entries: Replacement[]): Promise<void> {
    const buffer = await fs.readFile(file, 'utf-8');
    const contents = buffer.toString();

    const output = entries.reduce((acc, entry) => {
        const regexp = new RegExp(escapeStringRegexp(entry.match), 'g');
        return acc.replace(regexp, entry.replacement);
    }, contents);

    await fs.writeFile(file, output);
    console.log(`Writing ${file}`);
}

async function readJson<T>(file: string): Promise<T> {
    const buffer = await fs.readFile(file, 'utf-8');

    return JSON.parse(buffer.toString());
}
