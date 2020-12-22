import { LineOffset, Position } from './types';

const separator = '\n';

export function computeLineOffsets(contents: string): LineOffset[] {
    const lines = contents.split(separator);

    const initialState: LineOffset[] = [];
    const result = lines.reduce((acc, item, index) => {
        const lastEndOffset = acc.length === 0 ? 0 : acc[acc.length - 1].endOffset;
        const lineLength = item.length + separator.length;
        const lineOffset: LineOffset = {
            line: item,
            lineNumber: index + 1,
            startOffset: lastEndOffset,
            length: lineLength,
            endOffset: lastEndOffset + lineLength
        };
        return acc.concat(lineOffset);
    }, initialState);

    return result;
}

export function findOffset(lineOffsets: LineOffset[], offset: number): Position {
    for (let i = 0; i < lineOffsets.length; i++) {
        const lineOffset = lineOffsets[i];
        if (lineOffset.startOffset <= offset && offset < lineOffset.endOffset) {
            return {
                lineIndex: i,
                columnIndex: offset - lineOffset.startOffset
            };
        }
    }
    throw new Error(`Offset out of bounds: ${offset}`);
}
