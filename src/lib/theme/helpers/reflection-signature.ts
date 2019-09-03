import { ReflectionKind, SignatureReflection } from 'typedoc';
import { BRACE_CLOSE, BRACE_OPEN, DBL_NEWLINE, EMPTY_STR, INLINE, JOIN_COMMA, QUESTION_STR, SPACE_STR, THREE_DOTS, TICK_STR } from './constants';
import { memberVisibilitySymbol } from './member-visibility-symbol';
import { parameterTable } from './parameter-table';
import { _getHeadingString } from './reflection-basic';
import { comment, parseCommentText } from './reflection-comment';
import { sources } from './reflection-sources';
import { type } from './type';
import { typeParameters } from './type-parameters';

export function signature(this: SignatureReflection, headingLevel: number = 0, inline?: 'inline'): string {
    if (inline === INLINE) { return signature_inline(this); }

    const lines: string[] = [];

    lines.push(signatureTitle.call(this, this.parent.kind !== ReflectionKind.Function) as string);

    if (this.parameters && this.parameters.length) {
        lines.push(parameterTable.call(this.parameters) as string);
    }

    if (this.comment) {
        const commentString = comment.call(this, true);
        if (commentString) {
            lines.push(commentString as string);
        }

        if (this.comment.returns) {
            lines.push(RETURNS_PREFIX, parseCommentText(this.comment.returns, false));
        }
    }

    if (this.kind !== ReflectionKind.Function) {
        lines.push(sources.call(this) as string);
    }

    const headingStr = _getHeadingString(headingLevel);

    return (headingStr ? headingStr + SPACE_STR : EMPTY_STR) + lines.join(DBL_NEWLINE);
}

function signature_inline(ref: SignatureReflection) {
    const text: string[] = [];

    text.push(signature_name(ref));
    text.push(signature_type(ref));

    return text.join(EMPTY_STR);
}

export function signatureTitle(this: SignatureReflection, showSymbol: boolean = false) {
    const text: string[] = [];

    if (showSymbol === true) {
        if (this.parent.flags.isStatic) { text.push(STATIC_PREFIX); }
        text.push(memberVisibilitySymbol.call(this) + SPACE_STR);
    }

    text.push(TICK_STR + signature_name(this));
    text.push(signature_type(this, true).replace(' :', '` :'));

    return text.join(EMPTY_STR);
}

export function signature_name(ref: SignatureReflection|SignatureReflection[]) {
    if (Array.isArray(ref)) { ref = ref[0]; }

    if (!ref) { return ''; }

    let name = '';
    if (ref.name === __GET) { name = GET_PREFIX + ref.parent.name; }
    else if (ref.name === __SET) { name = SET_PREFIX + ref.parent.name; }
    else if (ref.name !== __CALL) { name = ref.name; }

    return ref.typeParameters ? name + typeParameters(ref.typeParameters) : name;
}

export function signature_type(ref: SignatureReflection|SignatureReflection[], hideTypes?: boolean) {
    if (!ref) { return 'void'; }
    if (!Array.isArray(ref)) { ref = [ref]; }

    if (ref.length === 0) { return 'void'; }

    const sig = ref[ref.length - 1];
    const text: string[] = [];

    if (sig.parameters) {
        const params = sig.parameters.map(p => {
            if (!hideTypes) {
                return (p.flags.isRest ? THREE_DOTS : EMPTY_STR) + TICK_STR + p.name + TICK_STR + (p.flags.isOptional ? QUESTION_STR : EMPTY_STR) + TYPE_SEPARATOR + type.call(p.type);
            } else {
                return (p.flags.isRest ? THREE_DOTS : EMPTY_STR) + p.name + (p.flags.isOptional ? QUESTION_STR : EMPTY_STR);
            }
        }).join(JOIN_COMMA);

        text.push(BRACE_OPEN + params + BRACE_CLOSE);
    } else {
        text.push(BRACES_EMPTY);
    }

    if (sig.type) { text.push(TYPE_SEPARATOR, type.call(sig.type) as string); }

    return text.join(EMPTY_STR);
}

const __GET = '__get';
const __SET = '__set';
const __CALL = '__call';

const GET_PREFIX = 'get ';
const SET_PREFIX = 'set ';
const STATIC_PREFIX = '🅢 ';

const RETURNS_PREFIX = '**Returns** ';

const TYPE_SEPARATOR = ' : ';
const BRACES_EMPTY = '()';
