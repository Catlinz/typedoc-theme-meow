import { DeclarationReflection, Reflection, ReflectionKind } from 'typedoc';

export function shouldShowHR(this: Reflection): boolean {
    switch (this.kind) {
        case ReflectionKind.TypeAlias:
        case ReflectionKind.Variable:
            return false;
        default:
            return true;
    }
}

export function shouldShowIndex(this: DeclarationReflection): boolean {
    return this.kind === ReflectionKind.Global;
}

export function shouldShowMemberTitle(this: DeclarationReflection): boolean {
    if (!this.name) { return false; }

    switch (this.kind) {
        case ReflectionKind.Constructor:
        case ReflectionKind.Property:
        case ReflectionKind.Accessor:
        case ReflectionKind.Method:
            return false;
        default:
            return true;
    }
}
