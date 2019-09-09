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
import { INLINE, JOIN_COMMA, JOIN_PIPE, TYPE_VOID, TYPE_UNKNOWN, EMPTY_STR, DBL_QUOTE_STR, JOIN_AND, BRACE_CURLY_CLOSE, BRACE_CURLY_OPEN, TICK_STR, BRACKET_CLOSE, BRACKET_OPEN, BRACKET_EMPTY, TYPE_START, TYPE_END } from './constants';
import { formatURLStr, properURL } from './formatting-basic';
import { signature } from './reflection-signature';

export function type<T extends Type>(this: T, inline?: 'inline') {
    if (!this) { return TYPE_VOID; }

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

export function isEnumMember(this: Reflection) {
    return this.kind === ReflectionKind.EnumMember;
}

export function isOtherReflection(this: Reflection) {
    switch (this.kind) {
        case ReflectionKind.Variable:
        case ReflectionKind.Function:
        case ReflectionKind.TypeAlias:
        case ReflectionKind.ObjectLiteral:
        case ReflectionKind.CallSignature:
        case ReflectionKind.EnumMember:
            return false;

        default:
            return true;
    }
}

function getReflectionType(model: ReflectionType) {
    if (model.declaration && model.declaration.children) {
        const inner = model.declaration.children.map(it => {
            return TICK_STR + it.name + '`: ' + type.call(it.type);
        }).join(JOIN_COMMA);

        return BRACE_CURLY_OPEN + inner + BRACE_CURLY_CLOSE;
    }

    if (model.declaration && model.declaration.signatures) {
        return model.declaration.signatures.map(it => signature.call(it, 0, INLINE) as string).join(JOIN_PIPE);
    }

    if (model.declaration.kind === ReflectionKind.ObjectLiteral) {
        return BRACE_CURLY_OPEN+BRACE_CURLY_CLOSE;
    }

    if (model.declaration.type) {
        return type.call(model.declaration.type);
    }

    return JSON.stringify(model.declaration.typeParameters);

    return model.declaration ? model.declaration.name : TYPE_UNKNOWN;
}

function getReferenceType(model: ReferenceType) {
    const reflection = model.reflection
        ? [formatURLStr(model.reflection.name, properURL(model.reflection.url))]
        : [model.name];
    if (model.typeArguments) {
        reflection.push(TYPE_START + model.typeArguments.map(typeArgument => type.call(typeArgument) as string).join(JOIN_COMMA) + TYPE_END);
    }
    return reflection.join(EMPTY_STR);
}

function getArrayType(model: ArrayType) {
    return type.call(model.elementType) + BRACKET_EMPTY;
}

function getUnionType(model: UnionType, expand?: boolean) {
    return model.types.map(unionType => type.call(unionType)).join(JOIN_PIPE);
}

function getIntersectionType(model: IntersectionType, expand?: boolean) {
    return model.types.map(intersectionType => type.call(intersectionType)).join(JOIN_AND);
}

function getTupleType(model: TupleType, expand?: boolean) {
    return BRACKET_OPEN + model.elements.map(element => type.call(element)).join(JOIN_COMMA) + BRACKET_CLOSE;
}

function getIntrinsicType(model: IntrinsicType) {
    return model.name;
}

function getStringLiteralType(model: StringLiteralType) {
    return DBL_QUOTE_STR + model.value + DBL_QUOTE_STR;
}
