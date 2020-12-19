import program from 'commander';
import fs from 'fs-extra';
import path from 'path';

import { findReplace } from '..';

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'package.json')).toString());

program
    .version(pkg.version)
    .option(
        '-f, --file [file...]',
        'Path or glob to a file to replace. Can be used multiple times. If not specified, will read from stdin.'
    )
    .arguments('<replacementFile>')
    .description(pkg.description, {
        replacementsFile: 'The JSON file containing matches and replacements'
    })
    .parse(process.argv);

main().catch(err => {
    console.error(`ERROR: ${err}`);
    process.exit(1);
});

async function main(): Promise<void> {
    const files = (program.file as string[] | undefined) || [];
    const replacementFiles = program.args || [];
    if (replacementFiles.length === 0) {
        throw new Error('Missing JSON replacement file. See -h for usage.');
    }

    if (replacementFiles.length > 1) {
        throw new Error('Cannot specify more than 1 JSON replacement file. See -h for usage.');
    }

    await findReplace({
        files,
        jsonConfigFile: replacementFiles[0]
    });
}
