import { DeclarationReflection, SignatureReflection } from 'typedoc';

import { DBL_NEWLINE, STAR_STR } from './constants';
import { typeAndParent } from './type-and-parent';

export function sources(ref: DeclarationReflection|SignatureReflection): string {
    const lines: string[] = [];

    if (ref.implementationOf) {
        lines.push(IMPLMENTATION_STR + typeAndParent(ref.implementationOf) + STAR_STR);
    }

    if (ref.inheritedFrom) {
        lines.push(INHERITED_STR + typeAndParent(ref.inheritedFrom) + STAR_STR);
    }

    if (ref.overwrites) {
        lines.push(OVERRIDE_STR + typeAndParent(ref.overwrites) + STAR_STR);
    }

    return lines.join(DBL_NEWLINE);
}

const IMPLMENTATION_STR = '*Implementation of ';
const INHERITED_STR = '*Inherited from ';
const OVERRIDE_STR = '*Overrides ';
