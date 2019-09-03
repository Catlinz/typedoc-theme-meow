import { DeclarationReflection, Reflection, ReflectionKind } from 'typedoc';
import {
    ArrayType,
    IntersectionType,
    IntrinsicType,
    ReferenceType,
    ReflectionType,
    StringLiteralType,
    TupleType,
    Type,
    TypeOperatorType,
    UnionType,
} from 'typedoc/dist/lib/models/types';
import { INLINE, JOIN_COMMA, JOIN_PIPE } from './constants';
import { properURL } from './formatting-basic';
import { signature } from './reflection-signature';

export function type<T extends Type>(this: T, inline?: 'inline') {
    if (!this) { return 'void'; }

    if (this instanceof ReflectionType && this.declaration) {
        return getReflectionType(this);
    }

    if (this instanceof ReferenceType && (this.reflection || this.name)) {
        return getReferenceType(this);
    }

    if (this instanceof ArrayType && this.elementType) {
        return getArrayType(this);
    }

    if (this instanceof UnionType && this.types) {
        return getUnionType(this);
    }

    if (this instanceof IntersectionType && this.types) {
        return getIntersectionType(this);
    }

    if (this instanceof TupleType && this.elements) {
        return getTupleType(this);
    }

    if (this instanceof IntrinsicType && this.name) {
        return getIntrinsicType(this);
    }

    if (this instanceof StringLiteralType && this.value) {
        return getStringLiteralType(this);
    }

    if (this instanceof TypeOperatorType || this instanceof ReflectionType) {
        return this;
    }

    if (this instanceof Reflection) {
        return reflectionType(this, inline);
    }

    return this;
}

export function reflectionType(ref: Reflection, inline?: 'inline') {
    switch (ref.kind) {
        case ReflectionKind.Method:
        case ReflectionKind.Function:
        case ReflectionKind.Constructor:
            return require('./reflection-signature').signature_type((ref as DeclarationReflection).signatures);

        case ReflectionKind.ObjectLiteral:
            return require('./reflection-object-literal').nested_object_literal(ref, inline);

        default:
            return type.call((ref as DeclarationReflection).type, inline);
    }
}

export function isVariable(this: Reflection) {
    return this.kind === ReflectionKind.Variable;
}

export function isFunction(this: Reflection) {
    return this.kind === ReflectionKind.Function;
}

export function isTypeAlias(this: Reflection) {
    return this.kind === ReflectionKind.TypeAlias;
}

export function isObjectLiteral(this: Reflection) {
    return this.kind === ReflectionKind.ObjectLiteral;
}

export function isCallSignature(this: Reflection) {
    return this.kind === ReflectionKind.CallSignature;
}

export function isOtherReflection(this: Reflection) {
    switch (this.kind) {
        case ReflectionKind.Variable:
        case ReflectionKind.Function:
        case ReflectionKind.TypeAlias:
        case ReflectionKind.ObjectLiteral:
        case ReflectionKind.CallSignature:
            return false;

        default:
            return true;
    }
}

function getReflectionType(model: ReflectionType) {
    if (model.declaration && model.declaration.children) {
        const inner = model.declaration.children.map(it => {
            return `\`${it.name}\`: ${type.call(it.type)}`;
        }).join(JOIN_COMMA);

        return `{${inner}}`;
    }

    if (model.declaration && model.declaration.signatures) {
        return model.declaration.signatures.map(it => signature.call(it, 0, INLINE) as string).join(JOIN_PIPE);
    }

    if (model.declaration.type) {
        return type.call(model.declaration.type);
    }

    return model.declaration ? model.declaration.name : 'unknown';
}

function getReferenceType(model: ReferenceType) {
    const reflection = model.reflection
        ? [`[${model.reflection.name}](${properURL(model.reflection.url)})`]
        : [model.name];
    if (model.typeArguments) {
        reflection.push(`‹${model.typeArguments.map(typeArgument => `${type.call(typeArgument)}`).join(', ')}›`);
    }
    return reflection.join('');
}

function getArrayType(model: ArrayType) {
    return `${type.call(model.elementType)}[]`;
}

function getUnionType(model: UnionType, expand?: boolean) {
    return model.types.map(unionType => type.call(unionType)).join(' | ');
}

function getIntersectionType(model: IntersectionType, expand?: boolean) {
    return model.types.map(intersectionType => type.call(intersectionType)).join(' & ');
}

function getTupleType(model: TupleType, expand?: boolean) {
    return `[${model.elements.map(element => type.call(element)).join(', ')}]`;
}

function getIntrinsicType(model: IntrinsicType) {
    return model.name;
}

function getStringLiteralType(model: StringLiteralType) {
    return `"${model.value}"`;
}
