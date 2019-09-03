import { TypeParameterReflection } from 'typedoc';

import { EMPTY_STR, JOIN_COMMA, GT_STR, LT_STR } from './constants';

export function typeParameters(this: TypeParameterReflection[]|void, parameters?: TypeParameterReflection[]): string {
    parameters = parameters || this as TypeParameterReflection[];
    if (!Array.isArray(parameters)) { return EMPTY_STR; }

    return LT_STR + parameters.map(it => it.name).join(JOIN_COMMA) + GT_STR;
}
