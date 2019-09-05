import { TypeParameterReflection } from 'typedoc';

import { EMPTY_STR, JOIN_COMMA, TYPE_START, TYPE_END } from './constants';

export function typeParameters(this: TypeParameterReflection[]|void, parameters?: TypeParameterReflection[]): string {
    parameters = parameters || this as TypeParameterReflection[];
    if (!Array.isArray(parameters)) { return EMPTY_STR; }

    return TYPE_START + parameters.map(it => it.name).join(JOIN_COMMA) + TYPE_END;
}
