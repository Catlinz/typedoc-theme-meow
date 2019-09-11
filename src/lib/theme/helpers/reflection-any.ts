import { DeclarationReflection, Reflection, ReflectionKind } from 'typedoc';

import { DBL_NEWLINE, THREE_DOTS, EMPTY_STR, QUESTION_STR } from './constants';
import { typeAlias, variable, variable_anchor, type_alias_anchor } from './reflection-basic';
import { signature } from './reflection-signature';
import { event, event_anchor } from './reflection-event';
import { enumMember } from './reflection-enum';
import { member } from './member';
import { declaration_anchor } from './reflection-declaration';

export function reflection(this: Reflection, headingLevel: number = 0, inline?: 'inline'): string {
    switch (this.kind) {
        case ReflectionKind.Event:
            return event.call(this, headingLevel, inline) as string;

        case ReflectionKind.Variable:
            return variable.call(this, headingLevel, inline) as string;

        case ReflectionKind.Function:
            return (this as DeclarationReflection).signatures.map(it => signature.call(it, headingLevel, inline) as string).join(DBL_NEWLINE);

        case ReflectionKind.TypeAlias:
            return typeAlias.call(this, headingLevel, inline) as string;

        case ReflectionKind.ObjectLiteral:
            return require('./reflection-object-literal').objectLiteral.call(this, headingLevel, inline, 0);

        case ReflectionKind.EnumMember:
            return enumMember.call(this, headingLevel) as string;

        case ReflectionKind.CallSignature:
            return signature.call(this, headingLevel, inline) as string;

        default:
            return member.call(this, headingLevel) as string;
    }
}

export function reflection_name(ref: Reflection) {
    switch (ref.kind) {
        case ReflectionKind.Method:
        case ReflectionKind.Function:
        case ReflectionKind.Constructor:
            return require('./reflection-signature').signature_name((ref as DeclarationReflection).signatures);

        case ReflectionKind.CallSignature:
        case ReflectionKind.GetSignature:
        case ReflectionKind.SetSignature:
            return require('./reflection-signature').signature_name(ref);

        default:
            return (ref.flags.isRest ? THREE_DOTS : EMPTY_STR) + ref.name + (ref.flags.isOptional ? QUESTION_STR : EMPTY_STR);
    }
}

export function reflection_anchor(ref: Reflection) {
    switch (ref.kind) {
        case ReflectionKind.Event:
            return event_anchor(ref as DeclarationReflection);
            
        case ReflectionKind.Variable:
            return variable_anchor(ref as DeclarationReflection);
        
        case ReflectionKind.TypeAlias:
            return type_alias_anchor(ref as DeclarationReflection);

        case ReflectionKind.Property:
            return declaration_anchor(ref as DeclarationReflection);

        case ReflectionKind.Function:
        case ReflectionKind.Method:
            return require('./reflection-signature').signature_anchor((ref as DeclarationReflection).signatures);
            
        case ReflectionKind.CallSignature:
        case ReflectionKind.GetSignature:
        case ReflectionKind.SetSignature:
            return require('./reflection-signature').signature_anchor(ref);
        
        default: 
            return default_anchor(ref);
    }
}

function default_anchor(ref: Reflection): string {
    function parseAnchorRef(ref0: string) {
        return ref0.replace(/"/g, '').replace(/ /g, '-');
    }
    let anchorPrefix = '';
    ref.flags.forEach(flag => (anchorPrefix += `${flag}-`));
    const prefixRef = parseAnchorRef(anchorPrefix);
    const reflectionRef = parseAnchorRef(ref.name);
    const anchorRef = prefixRef + reflectionRef;
    return anchorRef.toLowerCase();
}
