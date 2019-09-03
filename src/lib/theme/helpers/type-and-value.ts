import { DeclarationReflection } from 'typedoc';

import { EQUAL_SPACED_STR } from './constants';
import { type } from './type';

export function typeAndValue(this: DeclarationReflection): string {
    const typeStr = type.call(this.type) as string;
    const defaultValue = this.defaultValue;

    if (typeStr !== defaultValue) {
        return typeStr + EQUAL_SPACED_STR + defaultValue;
    } else {
        return typeStr;
    }
}
