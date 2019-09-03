import { CommentTag, Reflection } from 'typedoc/dist/lib/models';

export function comment(this: Reflection, withQuotes: boolean): string {
    if (!this || !this.comment) { return EMPTY_STR; }
    if (!withQuotes || typeof withQuotes !== BOOLEAN_TYPE) { withQuotes = false; }

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

    if (!withQuotes || typeof withQuotes !== BOOLEAN_TYPE) { withQuotes = false; }

    return withQuotes ? ('>' + text.replace(/\n/g, '\n>')) : text;
}

export function parseCommentTags(tags: CommentTag[]): string {
    const text: string[] = [];

    for (const tag of tags) {
        text.push('**`' + tag.tagName + '`**' + parseCommentText(tag.text));
    }

    return text.join('\n\n');
}

const EMPTY_STR = '';
const NEWLINE = '\n';
const DBL_NEWLINE = '\n\n';

const BOOLEAN_TYPE = 'boolean';
