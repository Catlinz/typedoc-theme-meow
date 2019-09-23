import { DeclarationReflection } from 'typedoc';

import { DBL_NEWLINE, EMPTY_STR, ASTERISK, COLON } from './constants';
import { formatURLStr } from './formatting-basic';

export function definition(this: DeclarationReflection|void, ref: DeclarationReflection): string {
    const lines: string[] = [];
    ref = (ref && ref instanceof DeclarationReflection) ? ref : this as DeclarationReflection;

    if (ref.sources && ref.sources.length > 0) {
        const firstSource = ref.sources[0];
        lines.push(DEFINED_AT + formatURLStr(ASTERISK + firstSource.file.fileName + COLON + firstSource.line + ASTERISK, firstSource.url));
    }

    if (ref.sources.length > 1) {
        for (let i = 1; i < ref.sources.length; ++i) {
            const source = ref.sources[i];
            lines.push(ALSO_DEFINED_AT, formatURLStr(ASTERISK + source.file.fileName + COLON + source.line + ASTERISK, source.url));
        }
    }
   
    return lines.length ? lines.join(DBL_NEWLINE) : EMPTY_STR;
}

const DEFINED_AT = '*Defined at* ';
const ALSO_DEFINED_AT = '*Also defined at* ';
