import { DeclarationReflection } from 'typedoc';

import { EQUAL_SPACED_STR } from './constants';
import { type } from './type';

export function typeAndValue(ref: DeclarationReflection): string {
    const typeStr = type.call(ref.type) as string;
    const defaultValue = ref.defaultValue;

    if (should_show_default_value(ref, typeStr)) {
        return typeStr + EQUAL_SPACED_STR + defaultValue;
    } else {
        return typeStr;
    }
}

export function should_show_default_value(ref: DeclarationReflection, notEqualTo?: string): boolean {
    const defaultValue = ref.defaultValue && ref.defaultValue.trim();

    if (defaultValue && defaultValue !== notEqualTo) {
        if (defaultValue === TRUE || defaultValue === FALSE || defaultValue === NULL || defaultValue === EMPTY_OBJ || defaultValue === EMPTY_ARRAY || defaultValue.match(STRING_VALUE_RE) || defaultValue.match(NUM_VALUE_RE)) {
            return true;
        }
    }

    return false;
}

const TRUE = 'true';
const FALSE = 'false';
const NULL = 'null';
const EMPTY_OBJ = '{}';
const EMPTY_ARRAY = '[]';

const STRING_VALUE_RE = /^".*"$/;
const NUM_VALUE_RE = /^[0-9A-Fa-f\.\-\+]+$/;
