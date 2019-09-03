import { DeclarationReflection, Reflection, ReflectionKind } from 'typedoc';
import { ReflectionGroup } from 'typedoc/dist/lib/models/ReflectionGroup';

import { DBL_NEWLINE, EMPTY_STR, INLINE, SPACE_STR, TICK_STR, EQUAL_SPACED_STR, COLON_SPACED_STR, JOIN_COMMA, TABLE_COL_PROP, TABLE_COL_TYPE, TABLE_COL_DEFAULT, TABLE_COL_DESC, PIPE_SPACED, DASH_STR, BRACE_CURLY_OPEN, BRACE_CURLY_CLOSE } from './constants';
import { reflection, reflection_name } from './reflection-any';
import { _getHeadingString } from './reflection-basic';
import { lowercase } from './formatting-basic';
import { comment } from './reflection-comment';
import { type } from './type';

export function objectLiteral(this: DeclarationReflection, headingLevel: number = 0, inline: 'inline', level: number = 0) {
    if (inline === INLINE) {
        if (this.name) {
            return TICK_STR + this.name + TICK_STR + EQUAL_SPACED_STR + nested_object_literal(this, inline, level);
        } else {
            return nested_object_literal(this, inline, level);
        }
    }

    if (level > 0) {
        return TICK_STR + this.name + TICK_STR + COLON_SPACED_STR + nested_object_literal(this, inline, level);
    }

    const text: string[] = [TICK_STR];

    if (this.flags && this.flags.length) { text.push(lowercase(this.flags), SPACE_STR); }
    text.push(this.name, TICK_STR);

    const commentText = (inline !== INLINE) ? comment.call(this, true) as string : EMPTY_STR;
    if (commentText) {
        text.push(DBL_NEWLINE, commentText);
    }

    text.push(DBL_NEWLINE, object_literal_table(this));

    const headingStr = _getHeadingString(headingLevel);

    return (headingStr ? headingStr + SPACE_STR : EMPTY_STR) + text.join(EMPTY_STR);
}

function object_literal_table(ref: DeclarationReflection): string {
    const hasDefaultValues = ref.children.some(it => it.defaultValue);
    const hasComments = ref.children.some(it => it.comment && (it.comment.text || it.comment.shortText));

    const headers = [TABLE_COL_PROP, TABLE_COL_TYPE];

    if (hasDefaultValues) { headers.push(TABLE_COL_DEFAULT); }
    if (hasComments) { headers.push(TABLE_COL_DESC); }

    let functionRows: string[] = [];
    let propRows: string[] = [];

    for (const group of ref.groups) {
        if (group.kind === ReflectionKind.Function) {
            functionRows = object_table_rows(group, hasDefaultValues, hasComments);
        } else {
            propRows = object_table_rows(group, hasDefaultValues, hasComments);
        }
    }

    return headers.join(PIPE_SPACED) + ' |\n' + headers.map(() => '------').join(' | ') + ' |\n' + [...functionRows, ...propRows].join(EMPTY_STR);
}

function object_table_rows(group: ReflectionGroup, hasDefaultValues: boolean, hasComments: boolean): string[] {
    const rows: string[] = [];

    for (const prop of group.children) {
        const row: string[] = [];

        row.push(TICK_STR + reflection_name(prop) + TICK_STR);
        row.push(getTypeOut(prop));

        if (hasDefaultValues) {
            row.push((prop as DeclarationReflection).defaultValue || DASH_STR);
        }

        if (hasComments) {
            row.push(comment.call(prop, false) || DASH_STR);
        }

        rows.push(row.join(PIPE_SPACED) + ' |\n');
    }

    return rows;
}

export function nested_object_literal(ref: DeclarationReflection, inline?: 'inline', level: number = 0): string {
    const methods: string[] = [];
    const variables: string[] = [];

    for (const group of ref.groups) {
        if (group.kind === ReflectionKind.Function) {
            for (const fn of group.children) {
                methods.push(reflection.call(fn, 0, INLINE));
            }
        } else {
            for (const prop of group.children) {
                if (prop.kind === ReflectionKind.ObjectLiteral) {
                    variables.push(objectLiteral.call(prop, 0, inline, level + 1));
                } else {
                    variables.push(reflection.call(prop, 0, INLINE));
                }
            }
        }
    }

    if (inline === INLINE) {
        return BRACE_CURLY_OPEN + [...methods, ...variables].join(JOIN_COMMA) + BRACE_CURLY_CLOSE;
    } else {
        const prefix = NBSP.repeat((level + 1) * 4);
        return '{<br>' + [...methods, ...variables].map(it => prefix + it).join(',<br>') + '<br>}';
    }
}

function getTypeOut(ref: Reflection, inline?: 'inline', level: number = 0): string {
    const typeStr = type.call(ref, inline).toString();
    return typeStr.replace(/\|/g, '\\|');
}

const NBSP = '&nbsp;';
