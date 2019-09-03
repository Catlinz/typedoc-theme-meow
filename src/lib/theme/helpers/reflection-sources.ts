import { DeclarationReflection } from 'typedoc';

import { DBL_NEWLINE, STAR_STR } from './constants';
import { typeAndParent } from './type-and-parent';

export function sources(this: DeclarationReflection): string {
    const lines: string[] = [];

    if (this.implementationOf) {
        lines.push(IMPLMENTATION_STR + typeAndParent.call(this.implementationOf) + STAR_STR);
    }

    if (this.inheritedFrom) {
        lines.push(INHERITED_STR + typeAndParent.call(this.inheritedFrom) + STAR_STR);
    }

    if (this.overwrites) {
        lines.push(OVERRIDE_STR + typeAndParent.call(this.overwrites) + STAR_STR);
    }

    return lines.join(DBL_NEWLINE);
}

const IMPLMENTATION_STR = '*Implementation of ';
const INHERITED_STR = '*Inherited from ';
const OVERRIDE_STR = '*Overrides ';
