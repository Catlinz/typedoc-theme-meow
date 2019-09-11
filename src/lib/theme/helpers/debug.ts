import { Reflection } from 'typedoc';
import { Comment, DeclarationReflection, Type, ArrayType, IntrinsicType, IntersectionType, ReferenceType, ReflectionType, StringLiteralType, TupleType, TypeOperatorType, TypeParameterType, UnionType, UnknownType, DeclarationHierarchy, ParameterReflection, TypeParameterReflection, SignatureReflection, ContainerReflection } from 'typedoc/dist/lib/models';
import { ReflectionCategory } from 'typedoc/dist/lib/models/ReflectionCategory';

const MAX_ITER = 2;

export function reflection_to_object(ref: Reflection|undefined, index: number) {
    if (!ref) { return null; }

    if (index > MAX_ITER) {
        return { error: 'reflection_to_object: Index To High' };
    }

    const obj = {
        id: ref.id,
        name: ref.name,
        kind: `${ref.kind} (${ref.kindString})`,
        hasOwnDocument: ref.hasOwnDocument || false,
        anchor: ref.anchor,
        flags: ref.flags,
        comment: comment_to_object(ref.comment),
        originalName: ref.originalName,
        parent: reflection_to_object(ref.parent, index + 1),
        // sources: ref.sources,
        url: ref.url,
    };

    if (ref instanceof ContainerReflection) {
        Object.assign(obj, {
            children: (ref.children || []).map(it => reflection_to_object(it, index + 1)),
            categories: (ref.categories || []).map(it => reflection_category_to_object(it, index + 1)),
            groups: (ref.groups || []).map(it => {
                return {
                    title: it.title,
                    allChildrenAreExternal: it.allChildrenAreExternal,
                    allChildrenAreInherited: it.allChildrenAreInherited,
                    allChildrenArePrivate: it.allChildrenArePrivate,
                    allChildrenAreProtectedOrPrivate: it.allChildrenAreProtectedOrPrivate,
                    allChildrenHaveOwnDocument: it.allChildrenHaveOwnDocument,
                    categories: (it.categories || []).map(cat => reflection_category_to_object(cat, index + 1)),
                    children: (it.children || []).map(it1 => reflection_to_object(it1, index + 1)),
                    kind: it.kind,
                    someChildrenAreExported: it.someChildrenAreExported,
                };
            }),
        });
    }

    if (ref instanceof DeclarationReflection) {
        Object.assign(obj, {
            defaultValue: ref.defaultValue,
            extendedBy: (ref.extendedBy || []).map(it => type_to_object(it, index + 1)),
            extendedTypes: (ref.extendedTypes || []).map(it => type_to_object(it, index + 1)),
            implementationOf: type_to_object(ref.implementationOf, index + 1),
            implementedBy: (ref.implementedBy || []).map(it => type_to_object(it, index + 1)),
            implementedTypes: (ref.implementedTypes || []).map(it => type_to_object(it, index + 1)),
            inheritedFrom: type_to_object(ref.inheritedFrom, index + 1),
            overwrites: type_to_object(ref.overwrites, index + 1),
            
            indexSignature: reflection_to_object(ref.indexSignature, index + 1),
            getSignature: reflection_to_object(ref.getSignature, index + 1),
            setSignature: reflection_to_object(ref.setSignature, index + 1),
            signatures: (ref.signatures || []).map(it => reflection_to_object(it, index + 1)),
            
            typeHierarchy: declaration_hierarchy_to_object(ref.typeHierarchy, index + 1),
            typeParameters: (ref.typeParameters || []).map(it => reflection_to_object(it, index + 1)),
        });
    }

    if (ref instanceof ParameterReflection) {
        Object.assign(obj, {
            type: type_to_object(ref.type, index + 1),
            defaultValue: ref.defaultValue,
        });
    }

    if (ref instanceof TypeParameterReflection) {
        Object.assign(obj, {
            type: type_to_object(ref.type, index + 1),
        });
    }

    if (ref instanceof SignatureReflection) {
        Object.assign(obj, {
            implementationOf: type_to_object(ref.implementationOf, index + 1),
            inheritedFrom: type_to_object(ref.inheritedFrom, index + 1),
            overwrites: type_to_object(ref.overwrites, index + 1),
            type: type_to_object(ref.type, index + 1),
            typeParameters: (ref.typeParameters || []).map(it => reflection_to_object(it, index + 1)),
        });
    }

    return obj;
}

export function reflection_category_to_object(cat: ReflectionCategory|undefined, index: number) {
    if (!cat) { return null; }
    if (index > MAX_ITER) {
        return { error: 'reflection_category_to_object: Index To High' };
    }

    return {
        title: cat.title,
        allChildrenHaveOwnDocument: cat.allChildrenHaveOwnDocument,
        children: (cat.children || []).map(it => reflection_to_object(it, index + 1)),
    };
}

export function comment_to_object(comment?: Comment) {
    if (!comment) { return null; }

    return {
        shortText: comment.shortText,
        text: comment.text,
        tags: (comment.tags || []).map(it => `${it.tagName} {${it.paramName}} ${it.text}`),
        returns: comment.returns,
    };
}

export function type_to_object(type: Type|undefined, index: number) {
    if (!type) { return null; }

    if (index > MAX_ITER) {
        return { error: 'type_to_object: Index To High' };
    }

    const obj = {
        type: type.type,
    };

    if (type instanceof ArrayType) {
        Object.assign(obj, { elementType: type_to_object(type.elementType, index + 1) });
    }

    if (type instanceof IntrinsicType) {
        Object.assign(obj, { name: type.name });
    }

    if (type instanceof IntersectionType) {
        Object.assign(obj, { types: (type.types || []).map(it => type_to_object(it, index + 1)) });
    }

    if (type instanceof ReferenceType) {
        Object.assign(obj, {
            name: type.name,
            reflection: reflection_to_object(type.reflection, index + 1),
            symbolID: type.symbolID,
            typeArguments: (type.typeArguments || []).map(it => type_to_object(it, index + 1)),
        });
    }

    if (type instanceof ReflectionType) {
        Object.assign(obj, { declaration: reflection_to_object(type.declaration, index + 1) });
    }

    if (type instanceof StringLiteralType) {
        Object.assign(obj, { value: type.value });
    }

    if (type instanceof TupleType) {
        Object.assign(obj, { elements: (type.elements || []).map(it => type_to_object(it, index + 1)) });
    }

    if (type instanceof TypeOperatorType) {
        Object.assign(obj, { operator: type.operator, target: type_to_object(type.target, index + 1) });
    }

    if (type instanceof TypeParameterType) {
        Object.assign(obj, { name: type.name, constraint: type_to_object(type.constraint, index + 1) });
    }

    if (type instanceof UnionType) {
        Object.assign(obj, { types: (type.types || []).map(it => type_to_object(it, index + 1)) });
    }

    if (type instanceof UnknownType) {
        Object.assign(obj, { name: type.name });
    }

    return obj;
}

export function declaration_hierarchy_to_object(h: DeclarationHierarchy|undefined, index: number) {
    if (!h) { return null; }
    if (index > MAX_ITER)  { 
        return { error: 'declaration_hierarchy_to_object: Index To High' };
    }

    return {
        isTarget: h.isTarget || false,
        types: (h.types || []).map(it => type_to_object(it, index + 1)),
        next: declaration_hierarchy_to_object(h.next, index + 1),
    };
}
