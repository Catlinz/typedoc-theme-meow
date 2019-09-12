import { CommentTag, Reflection } from 'typedoc/dist/lib/models';

import { DBL_NEWLINE, TYPE_BOOLEAN, EMPTY_STR, NEWLINE, SHORT_DBL_NEWLINE, DBL_STAR_STR, STAR_STR, SPACE_STR } from './constants';
import { find_reflection_string } from './reflection-utils';

export function comment(this: Reflection, withQuotes: boolean): string {
    if (!this || !this.comment) { return EMPTY_STR; }
    if (!withQuotes || typeof withQuotes !== TYPE_BOOLEAN) { withQuotes = false; }

    const text: string[] = [];

    if (this.comment.shortText) {
        text.push(parseCommentText(this.comment.shortText, withQuotes) + NEWLINE);
    }

    if (this.comment.text) {
        text.push(parseCommentText(this.comment.text, withQuotes) + NEWLINE);
    }

    if (this.comment.tags && this.comment.tags.length) {
        text.push(text.length ? NEWLINE : DBL_NEWLINE);
        text.push(parseCommentTags(this.comment.tags));
    }

    return text.join(EMPTY_STR);
}

export function parseCommentText(text: string, withQuotes?: boolean) {
    if (!text) { return EMPTY_STR; }

    if (!withQuotes || typeof withQuotes !== TYPE_BOOLEAN) { withQuotes = false; }

    return withQuotes ? (QUOTE_START + text.replace(/\n/g, QUOTE_END)) : text;
}

export function parseCommentTags(tags: CommentTag[]): string {
    const generic: string[] = [];

    const emits: string[] = [];
    const throws: string[] = [];
    const todo: string[] = [];
    const example: string[] = [];
    
    for (const tag of tags) {
        switch (tag.tagName.toLowerCase()) {
            case TAG_EMITS: 
                emits.push(parse_emits_tag(tag));
                break;
            case TAG_THROWS:
                throws.push(parse_throws_tag(tag));
                break;
            case TAG_TODO:
                todo.push(parse_todo_tag(tag));
                break;
            case TAG_EXAMPLE:
                example.push(parse_example_tag(tag));
                break;
            default:
                generic.push(DBL_STAR_STR + tag.tagName + DBL_STAR_STR + parseCommentText(tag.text));
                break;
        }
    }
    
    const lines: string[] = [];

    if (generic.length) { lines.push(generic.join(SHORT_DBL_NEWLINE)); }
    if (emits.length) { lines.push(emits.join(SHORT_DBL_NEWLINE)); }
    if (throws.length) { lines.push(throws.join(SHORT_DBL_NEWLINE)); }
    if (todo.length) { lines.push(todo.join(NEWLINE)); }
    if (example.length) { lines.push(example.join(DBL_NEWLINE)); }

    return lines.join(DBL_NEWLINE);
}

function parse_emits_tag(tag: CommentTag): string {
    const text: string[] = [EMIT_SYMBOL + DBL_STAR_STR + tag.tagName + DBL_STAR_STR];
    const eventTypeStr = find_reflection_string(pull_type_param_name(tag));
    const tagComment = parseCommentText(tag.text.trim());

    if (eventTypeStr) { text.push(eventTypeStr); }
    if (tagComment) { text.push(tagComment); }

    return text.join(SPACE_STR);
}

function parse_example_tag(tag: CommentTag): string {
    return DBL_STAR_STR + tag.tagName + DBL_STAR_STR + NEWLINE + '```typescript' + tag.text + '```';
}

function parse_throws_tag(tag: CommentTag): string {
    const text: string[] = [THROWS_SYMBOL + DBL_STAR_STR + tag.tagName + DBL_STAR_STR];
    const errorTypeStr = find_reflection_string(pull_type_param_name(tag));
    const tagComment = parseCommentText(tag.text.trim());

    if (errorTypeStr) { text.push(errorTypeStr); }
    if (tagComment) { text.push(tagComment); }

    return text.join(SPACE_STR);
}

function parse_todo_tag(tag: CommentTag): string {
    const text = STAR_STR + parseCommentText(tag.text).trim() + STAR_STR;
    return TODO_SYMBOL + DBL_STAR_STR + tag.tagName.toUpperCase() + DBL_STAR_STR + SPACE_STR + text;

}

function pull_type_param_name(tag: CommentTag): string {
    if (tag.paramName) { return tag.paramName; }
    if (!tag.text) { return EMPTY_STR; }

    const match = tag.text.match(PARAM_RE_BR);
    if (match && match[1]) {
        tag.text = tag.text.replace(match[0], EMPTY_STR);
        return match[1]; 
    }

    const match2 = tag.text.match(PARAM_RE);
    if (match2 && match2[1]) {
        tag.text = tag.text.replace(match2[0], EMPTY_STR);
        return match2[1];
    }

    return EMPTY_STR;
}

const QUOTE_START = '>';
const QUOTE_END = '\n>';

const EMIT_SYMBOL = '🗲 ';
const THROWS_SYMBOL = '☢ ';
const TODO_SYMBOL = '- [ ] ';

const TAG_EXAMPLE = 'example';
const TAG_EMITS = 'emits';
const TAG_THROWS = 'throws';
const TAG_TODO = 'todo';

const PARAM_RE_BR = /^\s*\{([a-zA-Z0-9]+)\}/;
const PARAM_RE = /^\s*([a-zA-Z0-9]+)/;
