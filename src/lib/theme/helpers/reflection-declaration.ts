import { DeclarationReflection, ReflectionKind } from 'typedoc';

import { DBL_NEWLINE, EMPTY_STR, INLINE, QUESTION_STR, SPACE_STR, TICK_STR } from './constants';
import { _getHeadingString } from './reflection-basic';
import { memberVisibilitySymbol } from './member';
import { comment } from './reflection-comment';
import { sources } from './reflection-sources';
import { type } from './type';
import { toAchorString } from './formatting-basic';

export function declaration(this: DeclarationReflection, headingLevel: number = 0, inline?: 'inline'): string {
    if (inline === INLINE) { return declaration_inline(this); }

    const lines: string[] = [];

    lines.push(declaration_title(this, this.kind === ReflectionKind.Property));

    const commentStr = comment.call(this, true) as string;
    if (commentStr) {
        lines.push(commentStr);
    }

    if (this.kind !== ReflectionKind.Function) {
        lines.push(sources.call(this) as string);
    }

    const headingStr = _getHeadingString(headingLevel);

    return (headingStr ? headingStr + SPACE_STR : EMPTY_STR) + lines.join(DBL_NEWLINE);
}

export function declaration_inline(ref: DeclarationReflection): string {
    return declaration_title(ref, false);
}

function declaration_title(ref: DeclarationReflection, showSymbol: boolean) {
    const text: string[] = [];

    if (showSymbol) {
        if (ref.flags.isStatic) { text.push(STATIC_PREFIX); }
        text.push(memberVisibilitySymbol(ref));
    }

    text.push(TICK_STR + ref.name + TICK_STR + (ref.flags.isOptional ? QUESTION_STR + TYPE_SEPARATOR : EMPTY_STR));
    if (!ref.flags.isOptional) {
        text.push(TYPE_SEPARATOR);
    }

    if (ref.type) {
        const typeStr = type.call(ref.type) as string;
        text.push(typeStr);

        if (ref.defaultValue && ref.defaultValue !== typeStr) {
            text.push(EQUALS + ref.defaultValue);
        }
    } else if (ref.defaultValue) {
        text.push(EQUALS + ref.defaultValue);
    }

    return text.join(SPACE_STR);
}

export function declaration_anchor(ref: DeclarationReflection): string {
    return toAchorString(declaration_title(ref, ref.kind === ReflectionKind.Property));
}

const STATIC_PREFIX = '🅢';
const TYPE_SEPARATOR = ':';
const EQUALS = '= ';
