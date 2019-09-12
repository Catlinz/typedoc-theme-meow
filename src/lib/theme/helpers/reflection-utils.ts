import { Reflection, ContainerReflection } from 'typedoc';
import MarkdownTheme from '../theme';
import { formatURLStr, properURL } from './formatting-basic';
import { TICK_STR } from './constants';

export function find_reflection(name: string|string[]): Reflection|null {
    const names = Array.isArray(name) ? name : name.split('.');

    let reflection = find_reflection_by_name(names.shift());

    while (names.length && reflection) {
        reflection = find_reflection_by_name(names.shift(), reflection);
    }

    return reflection || null;
}

export function find_reflection_string(name: string): string {
    const reflection = find_reflection(name);

    if (reflection) {
        return reflection.url ? formatURLStr(TICK_STR + reflection.name + TICK_STR, properURL(reflection.url)) : TICK_STR + reflection.name + TICK_STR;
    }
    
    return TICK_STR + name + TICK_STR;
}

function find_reflection_by_name(name: string, from?: Reflection): Reflection|null {
    if (!name) { return null; }
    const root = from || MarkdownTheme.rootReflection;

    if (!root) { return null; }

    const seen: {[key: number]: boolean} = {};
    const queue: Reflection[] = [root];
    while (queue.length) {
        const reflection = queue.shift();

        if (reflection.name === name) { return reflection; }

        if (!seen[reflection.id]) {
            seen[reflection.id] = true;

            if (reflection instanceof ContainerReflection && reflection.children) {
                queue.push(...reflection.children);
            }
        }
    }

    return null;
}
