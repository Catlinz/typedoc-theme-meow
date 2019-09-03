import { ReflectionKind, Reflection, DeclarationReflection } from 'typedoc';
import { PageEvent } from 'typedoc/dist/lib/output/events';

import { EMPTY_STR, DBL_STAR_STR, TICK_STR, COLON_SPACE_STR, JOIN_COMMA, LT_STR, GT_STR } from './constants';

export function reflectionTitle(this: PageEvent) {
    const model = this.model as DeclarationReflection;
    const title = [];

    if (model.kindString) {
        title.push(getReflectionTypeString(model) + COLON_SPACE_STR);
    }

    const isTopLevel = isTopLevelReflectionType(model);

    if (isTopLevel) { title.push(DBL_STAR_STR + TICK_STR); }

    if (model.typeParameters) {
        const typeParameters = model.typeParameters.map(typeParameter => typeParameter.name).join(JOIN_COMMA);
        // The < and > will be in `` so don't need to escape.
        title.push(model.name + LT_STR + typeParameters + GT_STR);
    } else {
        title.push(model.name);
    }

    if (isTopLevel) { title.push(TICK_STR + DBL_STAR_STR); }

    return title.join(EMPTY_STR);
}

function getReflectionTypeString(ref: Reflection): string {
    if (ref.kind === ReflectionKind.ExternalModule) {
        return FILE_STR;
    }

    return ref.kindString;
}

function isTopLevelReflectionType(ref: Reflection): boolean {
    switch (ref.kind) {
        case ReflectionKind.Class:
        case ReflectionKind.Interface:
        case ReflectionKind.Enum:
            return true;
        
        default:
            return false;
    }
}

export const FILE_STR = 'File';
