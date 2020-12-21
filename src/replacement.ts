import chalk from 'chalk';

export interface Replacement {
    find: string;
    replace: string;
    ignoreCase: boolean;
    wholeWord: boolean;
}

export type replaces = Replacement[];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function parseReplacements(input: any): Replacement[] {
    if (Array.isArray(input)) {
        return input.map(parseEntry);
    }
    return [parseEntry(input)];
}

function parseEntry(entry: any): Replacement {
    if (typeof entry !== 'object') {
        throw new Error(`Expected entry to be object, found ${typeof entry}`);
    }
    if (!('find' in entry)) {
        throw new Error(`No 'find' found in entry: ${JSON.stringify(entry)}`);
    }
    if (!('replace' in entry)) {
        throw new Error(`No 'replace' found in entry: ${JSON.stringify(entry)}`);
    }

    if (typeof entry.find !== 'string') {
        throw new Error(`Expected 'find' to be string, found ${typeof entry.find}: ${JSON.stringify(entry)}`);
    }
    if (typeof entry.replace !== 'string') {
        throw new Error(`Expected 'replace' to be string, found ${typeof entry.find}: ${JSON.stringify(entry)}`);
    }
    const ignoreCase = 'ignoreCase' in entry && entry.ignoreCase === true;
    const wholeWord = 'wholeWord' in entry && entry.wholeWord === true;

    return {
        find: entry.find,
        replace: entry.replace,
        ignoreCase,
        wholeWord
    };
}

export function replacementToString(item: Replacement): string {
    return `${chalk.bold(item.find)} => ${chalk.bold(item.replace)}${item.wholeWord ? chalk.gray(' [wholeWord]') : ''}${
        item.ignoreCase ? chalk.gray(' [ignoreCase]') : ''
    }`;
}
