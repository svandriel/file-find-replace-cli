export interface Replacement {
    match: string;
    replacement: string;
}

export type Replacements = Replacement[];

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
    if (!('match' in entry)) {
        throw new Error(`No 'match' found in entry: ${JSON.stringify(entry)}`);
    }
    if (!('replacement' in entry)) {
        throw new Error(`No 'match' found in entry: ${JSON.stringify(entry)}`);
    }

    if (typeof entry.match !== 'string') {
        throw new Error(`Expected 'match' to be string, found ${typeof entry.match}: ${JSON.stringify(entry)}`);
    }
    if (typeof entry.replacement !== 'string') {
        throw new Error(`Expected 'replacement' to be string, found ${typeof entry.match}: ${JSON.stringify(entry)}`);
    }

    return {
        match: entry.match,
        replacement: entry.replacement
    };
}
