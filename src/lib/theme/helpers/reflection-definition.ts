import { DeclarationReflection } from 'typedoc';

import { DBL_NEWLINE, EMPTY_STR, ASTERISK, COLON } from './constants';
import { formatURLStr } from './formatting-basic';

export function definition(this: DeclarationReflection): string {
    const lines: string[] = [];

    if (this.sources && this.sources.length > 0) {
        lines.push(DEFINED_AT + formatURLStr(ASTERISK + this.sources[0].file.fileName + COLON + this.sources[0].line + ASTERISK, this.sources[0].url));
    }

    if (this.sources.length > 1) {
        for (let i = 1; i < this.sources.length; ++i) {
            const source = this.sources[i];
            lines.push(ALSO_DEFINED_AT, formatURLStr(ASTERISK + source.file.fileName + COLON + source.line + ASTERISK, source.url));
        }
    }
   
    return lines.length ? lines.join(DBL_NEWLINE) : EMPTY_STR;
}

const DEFINED_AT = '*Defined at* ';
const ALSO_DEFINED_AT = '*Also defined at* ';
