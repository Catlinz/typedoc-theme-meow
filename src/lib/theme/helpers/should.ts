import { DeclarationReflection, Reflection, ReflectionKind } from 'typedoc';

export function shouldShowHR(this: Reflection): boolean {
    if (!this.kind) { return false; }

    switch (this.kind) {
        case ReflectionKind.TypeAlias:
        case ReflectionKind.Variable:
        case ReflectionKind.EnumMember:
        case ReflectionKind.Property:
        case ReflectionKind.Event:
            return false;
        default:
            return true;
    }
}

export function shouldShowIndex(this: Reflection): boolean {
    return !!this && this.kind === ReflectionKind.Global;
}

export function shouldShowMemberTitle(this: DeclarationReflection): boolean {
    if (!this || !this.name) { return false; }

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
