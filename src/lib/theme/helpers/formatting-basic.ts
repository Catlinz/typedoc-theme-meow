import { Reflection } from 'typedoc/dist/lib/models/reflections';

export function br(count?: number) {
    return (count && typeof count === 'number') ? NEWLINE.repeat(count) : NEWLINE;
}

export function heading(level?: number) {
    return (level && typeof level === 'number') ? HEADING.repeat(level) : HEADING;
}

export function lowercase(values: string|string[]): string {
    if (!values || values.length < 1) { return ''; }

    if (typeof values === 'string') { return values.toLowerCase(); }

    return values.map(it => it.toLowerCase()).join(' ');
}

export function stripLineBreaks(this: string) {
    return this.replace(/\n/g, SPACE);
}

export function properURL(this: Reflection|void, url?: string) {
    if (url) {
        return URL_PREFIX + url;
    } else if (this && this.url) {
        return URL_PREFIX + this.url;
    }
}

const SPACE = ' ';
const HEADING = '#';
const NEWLINE = '\n';
const URL_PREFIX = '/docs/';
