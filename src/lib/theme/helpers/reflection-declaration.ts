import { DeclarationReflection, ReflectionKind } from 'typedoc';

import { DBL_NEWLINE, EMPTY_STR, INLINE, QUESTION_STR, SPACE_STR, TICK_STR, STATIC_PREFIX } from './constants';
import { should_show_default_value } from './type-and-value';
import { _getHeadingString } from './reflection-basic';
import { toAchorString } from './formatting-basic';
import { memberVisibilitySymbol } from './member';
import { comment } from './reflection-comment';
import { sources } from './reflection-sources';
import { type } from './type';

export function declaration(ref: DeclarationReflection, headingLevel: number = 0, inline?: 'inline'): string {
    if (inline === INLINE) { return declaration_inline(ref); }

    const lines: string[] = [];

    lines.push(declaration_title(ref, ref.kind === ReflectionKind.Property));

    const commentStr = comment.call(ref, true) as string;
    if (commentStr) {
        lines.push(commentStr);
    }

    if (ref.kind !== ReflectionKind.Function) {
        lines.push(sources(ref));
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

        if (should_show_default_value(ref, typeStr)) {
            text.push(EQUALS + ref.defaultValue);
        }
    } else if (should_show_default_value(ref)) {
        text.push(EQUALS + ref.defaultValue);
    }

    return text.join(SPACE_STR);
}

export function declaration_anchor(ref: DeclarationReflection): string {
    return toAchorString(declaration_title(ref, ref.kind === ReflectionKind.Property));
}

const TYPE_SEPARATOR = ':';
const EQUALS = '= ';
