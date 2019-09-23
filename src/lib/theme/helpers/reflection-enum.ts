import { DeclarationReflection, Reflection } from 'typedoc';

import { TICK_STR, EQUAL_STR, SPACE_STR, DBL_NEWLINE } from './constants';
import { comment } from './reflection-comment';
import { heading } from './formatting-basic';

export function enumMember(ref: Reflection, headingLevel?: number): string {
    const text: string[] = [heading(headingLevel)];

    text.push(TICK_STR + ref.name + TICK_STR);
    text.push(EQUAL_STR);
    text.push((ref as DeclarationReflection).defaultValue);

    const commentStr = comment.call(ref, true);

    return commentStr ? text.join(SPACE_STR) + DBL_NEWLINE + commentStr : text.join(SPACE_STR);
}
