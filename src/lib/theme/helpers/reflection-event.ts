import { ReferenceType, ReflectionKind, Reflection } from 'typedoc/dist/lib/models';
import { DeclarationReflection } from 'typedoc';

import { EMPTY_STR, SPACE_STR, DBL_NEWLINE, TYPE_END, TICK_STR, STATIC_PREFIX } from './constants';
import { toAchorString, heading } from './formatting-basic';
import { _getHeadingString } from './reflection-basic';
import { memberVisibilitySymbol } from './member';
import { comment } from './reflection-comment';
import { type } from './type';

export function event(ref: Reflection, headingLevel: number = 0, inline?: 'inline'): string {
    const commentText = comment.call(ref, true);
    const title = event_title(ref as DeclarationReflection, (ref.parent.kind & ReflectionKind.ClassOrInterface) !== 0);

    return heading(headingLevel + 1) + SPACE_STR + title + (commentText ? DBL_NEWLINE + commentText : EMPTY_STR);
}

export function event_type(ref: DeclarationReflection): string {
    if (ref.getSignature && ref.getSignature.type) {
        if ((ref.getSignature.type as ReferenceType).name === 'IEvent') {
            return type.call((ref.getSignature.type as ReferenceType).typeArguments[0]) as string;
        }
        return type.call(ref.getSignature.type) as string;
    }

    return type.call(ref.type) as string;
}

export function event_title(ref: DeclarationReflection, showSymbol?: boolean): string {
    const text: string[] = [];

    if (showSymbol) {
        if (ref.flags.isStatic) { text.push(STATIC_PREFIX); }
        text.push(memberVisibilitySymbol(ref));
    }
    
    text.push(
        TICK_STR + ref.name + TICK_STR,
        TYPE_END+TYPE_END,
        event_type(ref),
    );

    return text.join(SPACE_STR);
}

export function event_anchor(ref: DeclarationReflection): string {
    return toAchorString(event_title(ref, ref.parent && (ref.parent.kind & ReflectionKind.ClassOrInterface) !== 0));
}
