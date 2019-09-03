import { DeclarationReflection } from 'typedoc';
import { DBL_NEWLINE, EMPTY_STR, INLINE, SPACE_STR, TICK_STR } from './constants';
import { heading, lowercase } from './formatting-basic';
import { comment } from './reflection-comment';
import { type } from './type';
import { typeAndValue } from './type-and-value';
import { typeParameters } from './type-parameters';

export function variable(this: DeclarationReflection, headingLevel: number = 0, inline: 'inline'): string {
    const text: string[] = [TICK_STR];

    if (this.flags && this.flags.length) { text.push(lowercase(this.flags), SPACE_STR); }

    text.push(this.name, '` : ', typeAndValue.call(this) as string);

    if (inline !== INLINE) {
        if (this.sources && this.sources[0] && this.sources[0].url) {
            text.push(SPACE_STR, '[⮡](', this.sources[0].url, ')');
        }
    }

    const commentText = (inline !== INLINE) ? comment.call(this, true) : EMPTY_STR;
    const headingStr = _getHeadingString(headingLevel);

    return (headingStr ? headingStr + SPACE_STR : EMPTY_STR) + text.join(EMPTY_STR) + (commentText ? DBL_NEWLINE + commentText : EMPTY_STR);
}

export function typeAlias(this: DeclarationReflection, headingLevel: number = 0, inline: 'inline'): string {
    const text: string[] = [TICK_STR];

    if (this.flags && this.flags.length) { text.push(lowercase(this.flags), SPACE_STR); }

    text.push(this.name, TICK_STR, typeParameters(this.typeParameters), ' = ', type.call(this.type));

    const commentText = (inline !== INLINE) ? comment.call(this, true) : '';
    const headingStr = _getHeadingString(headingLevel);

    return (headingStr ? headingStr + SPACE_STR : EMPTY_STR) + text.join(EMPTY_STR) + (commentText ? DBL_NEWLINE + commentText : EMPTY_STR);
}

export function _getHeadingString(headingLevel: number): string {
    return (headingLevel && typeof headingLevel === 'number') ? heading(headingLevel) : '';
}
