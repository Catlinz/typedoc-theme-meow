import { Reflection, ReflectionKind } from 'typedoc';

import { EMPTY_STR } from './constants';

export function reflectionSymbol(this: Reflection): string {
    switch (this.kind) {
        case ReflectionKind.Class:
            return SYM_CLASS;

        case ReflectionKind.Enum:
            return SYM_ENUM;
        
        case ReflectionKind.Function:
            return SYM_FUNCTION;
        
        case ReflectionKind.Interface:
            return SYM_INTERFACE;
        
        case ReflectionKind.TypeAlias:
            return SYM_TYPEALIAS;
        
        case ReflectionKind.Variable:
            return SYM_VARIABLE;
        
        default:
            return EMPTY_STR;
    }
}

const SYM_CLASS = '🅲';
const SYM_ENUM = '🅴';
const SYM_FUNCTION = '🅵';
const SYM_INTERFACE = '🅸';
const SYM_TYPEALIAS = '🆃';
const SYM_VARIABLE = '🆅';
