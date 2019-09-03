import { DeclarationReflection } from 'typedoc';

import { TICK_STR, EQUAL_STR, SPACE_STR, DBL_NEWLINE } from './constants';
import { comment } from './reflection-comment';
import { heading } from './formatting-basic';

export function enumMember(this: DeclarationReflection, headingLevel?: number): string {
    const text: string[] = [heading(headingLevel)];

    text.push(TICK_STR + this.name + TICK_STR);
    text.push(EQUAL_STR);
    text.push(this.defaultValue);

    const commentStr = comment.call(this, true);

    return commentStr ? text.join(SPACE_STR) + DBL_NEWLINE + commentStr : text.join(SPACE_STR);
}
