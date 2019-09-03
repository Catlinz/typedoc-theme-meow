import { DeclarationReflection, Reflection, ReflectionKind } from 'typedoc';
import { ReflectionGroup } from 'typedoc/dist/lib/models/ReflectionGroup';
import { DBL_NEWLINE, EMPTY_STR, INLINE, SPACE_STR, TICK_STR } from './constants';
import { lowercase } from './formatting-basic';
import { reflection, reflection_name } from './reflection-any';
import { _getHeadingString } from './reflection-basic';
import { comment } from './reflection-comment';
import { type } from './type';

export function objectLiteral(this: DeclarationReflection, headingLevel: number = 0, inline: 'inline', level: number = 0) {
    if (inline === INLINE) {
        if (this.name) {
            return TICK_STR + this.name + TICK_STR + ' = ' + nested_object_literal(this, inline, level);
        } else {
            return nested_object_literal(this, inline, level);
        }
    }

    if (level > 0) {
        return TICK_STR + this.name + TICK_STR + ' : ' + nested_object_literal(this, inline, level);
    }

    const text: string[] = [TICK_STR];

    if (this.flags && this.flags.length) { text.push(lowercase(this.flags), SPACE_STR); }
    text.push(this.name, TICK_STR);

    const commentText = (inline !== INLINE) ? comment.call(this, true) : EMPTY_STR;
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

    const headers = ['Property', 'Type'];

    if (hasDefaultValues) { headers.push('Default'); }
    if (hasComments) { headers.push('Description'); }

    let functionRows: string[] = [];
    let propRows: string[] = [];

    for (const group of ref.groups) {
        if (group.kind === ReflectionKind.Function) {
            functionRows = object_table_rows(group, hasDefaultValues, hasComments);
        } else {
            propRows = object_table_rows(group, hasDefaultValues, hasComments);
        }
    }

    return headers.join(' | ') + ' |\n' + headers.map(() => '------').join(' | ') + ' |\n' + [...functionRows, ...propRows].join('');
}

function object_table_rows(group: ReflectionGroup, hasDefaultValues: boolean, hasComments: boolean): string[] {
    const rows: string[] = [];

    for (const prop of group.children) {
        const row: string[] = [];

        row.push(TICK_STR + reflection_name(prop) + TICK_STR);
        row.push(getTypeOut(prop));

        if (hasDefaultValues) {
            row.push((prop as DeclarationReflection).defaultValue || '-');
        }

        if (hasComments) {
            row.push(comment.call(prop, false) || '-');
        }

        rows.push(row.join(' | ') + ' |\n');
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
        return '{' + [...methods, ...variables].join(', ') + '}';
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
