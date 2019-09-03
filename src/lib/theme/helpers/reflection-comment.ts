import { CommentTag, Reflection } from 'typedoc/dist/lib/models';

import { DBL_NEWLINE, TYPE_BOOLEAN, EMPTY_STR, NEWLINE, SHORT_DBL_NEWLINE } from './constants';

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
    const text: string[] = [];

    for (const tag of tags) {
        switch (tag.tagName) {
            case TAG_EXAMPLE:
                text.push(parseExampleCommentTag(tag));
                break;
            default:
                text.push(TAG_START + tag.tagName + TAG_END + parseCommentText(tag.text));
                break;
        }
    }

    return text.join(SHORT_DBL_NEWLINE);
}

function parseExampleCommentTag(tag: CommentTag): string {
    return TAG_START + tag.tagName + TAG_END + NEWLINE + '```typescript' + tag.text + '```';
}

const QUOTE_START = '>';
const QUOTE_END = '\n>';

const TAG_START = '**`';
const TAG_END = '`** ';

const TAG_EXAMPLE = 'example';
