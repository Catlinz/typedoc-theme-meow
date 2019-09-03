import { Reflection } from 'typedoc/dist/lib/models/reflections';

import { TYPE_NUMBER, TYPE_STRING, SPACE_STR, EMPTY_STR, NEWLINE, BRACE_CLOSE } from './constants';

export function br(count?: number) {
    return (count && typeof count === TYPE_NUMBER) ? NEWLINE.repeat(count) : NEWLINE;
}

export function heading(level?: number) {
    return (level && typeof level === TYPE_NUMBER) ? HEADING.repeat(level) : HEADING;
}

export function lowercase(values: string|string[]): string {
    if (!values || values.length < 1) { return EMPTY_STR; }

    if (typeof values === TYPE_STRING) { return (values as string).toLowerCase(); }

    return (values as string[]).map(it => it.toLowerCase()).join(SPACE_STR);
}

export function stripLineBreaks(this: string) {
    return this.replace(NEWLINE_RE, SPACE_STR);
}

export function properURL(this: Reflection|void, url?: string) {
    if (url) {
        return URL_PREFIX + url;
    } else if (this && this.url) {
        return URL_PREFIX + this.url;
    }
    else {
        return EMPTY_STR;
    }
}

export function formatURLStr(name: string, url: string): string {
    return URL_START + name + URL_MID + url + BRACE_CLOSE;
}

const URL_START = '[';
const URL_MID = '](';

const HEADING = '#';
const URL_PREFIX = '/docs/';

const NEWLINE_RE = /\n/g;
