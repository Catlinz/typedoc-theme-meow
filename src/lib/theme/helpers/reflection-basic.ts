import { DeclarationReflection } from 'typedoc';

import { DBL_NEWLINE, EMPTY_STR, INLINE, SPACE_STR, TICK_STR, TYPE_NUMBER, BRACE_CLOSE, COLON_SPACED_STR, EQUAL_SPACED_STR, DASH_STR, DBL_DASH } from './constants';
import { heading, lowercase, toAchorString } from './formatting-basic';
import { typeParameters } from './type-parameters';
import { typeAndValue } from './type-and-value';
import { comment } from './reflection-comment';
import { type } from './type';

export function variable(ref: DeclarationReflection, headingLevel: number = 0, inline: 'inline'): string {
    const text: string[] = [TICK_STR];

    if (ref.flags && ref.flags.length) { text.push(lowercase(ref.flags), SPACE_STR); }

    text.push(ref.name, TICK_STR, COLON_SPACED_STR, typeAndValue(ref));

    if (inline !== INLINE) {
        if (ref.sources && ref.sources[0] && ref.sources[0].url) {
            text.push(LINK_START, ref.sources[0].url, BRACE_CLOSE);
        }
    }

    const commentText = (inline !== INLINE) ? comment.call(ref, true) : EMPTY_STR;
    const headingStr = _getHeadingString(headingLevel);

    return (headingStr ? headingStr + SPACE_STR : EMPTY_STR) + text.join(EMPTY_STR) + (commentText ? DBL_NEWLINE + commentText : EMPTY_STR);
}

export function variable_anchor(ref: DeclarationReflection): string {
    const textBase = ref.name+ DBL_DASH + (typeAndValue(ref)) + DASH_STR;
    
    return toAchorString((ref.flags && ref.flags.length) ? lowercase(ref.flags) + DASH_STR + textBase : textBase);
}

export function typeAlias(ref: DeclarationReflection, headingLevel: number = 0, inline: 'inline'): string {
    const text: string[] = [TICK_STR];

    if (ref.flags && ref.flags.length) { text.push(lowercase(ref.flags), SPACE_STR); }

    text.push(ref.name, TICK_STR, typeParameters(ref.typeParameters), EQUAL_SPACED_STR, type.call(ref.type) as string);

    const commentText = (inline !== INLINE) ? comment.call(ref, true) : EMPTY_STR;
    const headingStr = _getHeadingString(headingLevel);

    return (headingStr ? headingStr + SPACE_STR : EMPTY_STR) + text.join(EMPTY_STR) + (commentText ? DBL_NEWLINE + commentText : EMPTY_STR);
}

export function type_alias_anchor(ref: DeclarationReflection): string {
    return toAchorString(ref.name + typeParameters(ref.typeParameters) + DBL_DASH + (type.call(ref) as string));
}

export function _getHeadingString(headingLevel: number): string {
    return (headingLevel && typeof headingLevel === TYPE_NUMBER) ? heading(headingLevel) : EMPTY_STR;
}

const LINK_START = ' [⮡](';
