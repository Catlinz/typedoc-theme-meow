import { DeclarationReflection } from 'typedoc';
import { DBL_NEWLINE, STAR_STR } from './constants';
import { typeAndParent } from './type-and-parent';

export function sources(this: DeclarationReflection): string {
    const lines: string[] = [];

    if (this.implementationOf) {
        lines.push('*Implementation of ', typeAndParent.call(this.implementationOf), STAR_STR);
    }

    if (this.inheritedFrom) {
        lines.push('*Inherited from ', typeAndParent.call(this.inheritedFrom), STAR_STR);
    }

    if (this.overwrites) {
        lines.push('*Overrides ', typeAndParent.call(this.overwrites), STAR_STR);
    }

    return lines.join(DBL_NEWLINE);
}
