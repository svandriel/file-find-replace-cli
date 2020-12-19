#!/usr/bin/env node

import program from 'commander';
import fs from 'fs-extra';
import path from 'path';

import { findReplace } from '..';

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'package.json')).toString());

program
    .version(pkg.version)
    .usage('<replacementFile> [options]')
    .arguments('<replacementFile>')
    .description(
        'Command line tool for replacing text in files, using a JSON file containining matches and replacements.\n' +
            "The JSON file must contain an object (or array of objects), each containing a 'find' and 'replace' entry",
        {
            replacementFile: 'The JSON file containing matches and replacements'
        }
    )
    .option('-f, --file [file...]', 'Path or glob to a file to replace. Can be used multiple times.')
    .option('-v, --verbose', 'Turns on verbose mode')
    .parse(process.argv);

main().catch(err => {
    console.error(`ERROR: ${err}`);
    process.exit(1);
});

async function main(): Promise<void> {
    const files = (program.file as string[] | undefined) || [];
    const replacementFiles = program.args || [];
    const verbose = (program.verbose as boolean | undefined) || false;
    if (replacementFiles.length === 0) {
        throw new Error('Missing JSON replacement file. This must be the first argument. See -h for usage.');
    }

    if (replacementFiles.length > 1) {
        throw new Error('Cannot specify more than 1 JSON replacement file. See -h for usage.');
    }

    const jsonConfigFile = replacementFiles[0];

    await findReplace({
        files,
        jsonConfigFile,
        verbose
    });
}
