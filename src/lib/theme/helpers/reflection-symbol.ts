import { Reflection, ReflectionKind } from 'typedoc';

export function reflectionSymbol(this: Reflection): string {
    switch (this.kind) {
        case ReflectionKind.Class:
            return '🅲';
        case ReflectionKind.Enum:
            return '🅴';
        case ReflectionKind.Function:
            return '🅵';
        case ReflectionKind.Interface:
            return '🅸';
        case ReflectionKind.TypeAlias:
            return '🆃';
        case ReflectionKind.Variable:
            return '🆅';
        default:
            return '';
    }
}
