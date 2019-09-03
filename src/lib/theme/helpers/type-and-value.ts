import { DeclarationReflection } from 'typedoc';
import { type } from './type';

export function typeAndValue(this: DeclarationReflection): string {
    const typeStr = type.call(this.type);
    const defaultValue = this.defaultValue;

    if (typeStr !== defaultValue) {
        return `${typeStr} = ${defaultValue}`;
    } else {
        return typeStr;
    }
}
