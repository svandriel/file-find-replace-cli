import chalk from 'chalk';

export interface FindReplaceResult {
    file: string;
    replaceCount: number;
}

export function findReplaceResultToString(result: FindReplaceResult): string {
    return `${chalk.cyan(result.file)} - ${chalk.bold(result.replaceCount)} replacements`;
}
