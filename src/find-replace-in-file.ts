import fs from 'fs-extra';

import { applyReplacement } from './apply-replacement';
import { Replacement } from './replacement';
import { FindReplaceResult } from './types';

export async function findReplaceInFile(
    file: string,
    replacements: Replacement[],
    verbose = false
): Promise<FindReplaceResult> {
    const buffer = await fs.readFile(file, 'utf-8');
    const contents = buffer.toString();

    const output = replacements.reduce(
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
    return {
        file,
        replaceCount: output.replaceCount
    };
}
