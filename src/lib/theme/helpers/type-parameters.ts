import { TypeParameterReflection } from 'typedoc';

export function typeParameters(this: TypeParameterReflection[]|void, parameters?: TypeParameterReflection[]): string {
    parameters = parameters || this as TypeParameterReflection[];
    if (!Array.isArray(parameters)) { return ''; }

    return `<${parameters.map(it => it.name).join(', ')}>`;
}
