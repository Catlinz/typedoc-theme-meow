import { DeclarationReflection } from 'typedoc';

export function hasAncestor(this: DeclarationReflection): boolean {
    if (this.typeHierarchy && this.typeHierarchy.types && this.typeHierarchy.types.length > 0) {
        return this.typeHierarchy.types.length > 1 || !this.typeHierarchy.isTarget;
    }
    return false;
}
