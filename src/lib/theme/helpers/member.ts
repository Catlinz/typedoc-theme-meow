import { DeclarationReflection, ReflectionKind, Reflection } from 'typedoc';
import { heading, formatURLStr } from './formatting-basic';
import { shouldShowMemberTitle } from './should';
import { DBL_NEWLINE, SPACE_STR, TICK_STR } from './constants';

export function member(this: DeclarationReflection, headingLevel?: number): string {
    const lines: string[] = [];
    const signature = (require('./reflection-signature') as typeof import('./reflection-signature')).signature;

    if (shouldShowMemberTitle.call(this)) {
        lines.push(memberTitle.call(this, headingLevel) as string);
    }

    if (this.signatures && this.signatures.length) {
        for (const sig of this.signatures) {
            lines.push(signature.call(sig, 3) as string);
        }
    }
    else if (this.hasGetterOrSetter()) {
        if (this.getSignature) {
            lines.push(signature.call(this.getSignature, 3) as string);
        }
        if (this.setSignature) {
            lines.push(signature.call(this.setSignature, 3) as string);
        }
    }
    else {
        const declaration = (require('./reflection-declaration') as typeof import('./reflection-declaration')).declaration;
        lines.push(declaration.call(this, 3) as string);
    }

    return lines.join(DBL_NEWLINE);
}

export function memberTitle(this: DeclarationReflection, headingLevel?: number): string {
  const md = [heading(headingLevel)];
  if (this.flags) {
    md.push(this.flags.map(flag => TICK_STR+flag+TICK_STR).join(SPACE_STR));
  }
  md.push(this.name);
  return md.join(SPACE_STR);
}

export function memberVisibilitySymbol(ref: Reflection): string {
    let symbol = PUBLIC_SYMBOL;

    const flags = PARENT_TYPES.includes(ref.kind) ? ref.parent.flags : ref.flags;

    if (flags.isProtected) { symbol = PROTECTED_SYMBOL; }
    if (flags.isPrivate) { symbol = PRIVATE_SYMBOL; }

    if (ref.sources && ref.sources.length) {
        return formatURLStr(symbol, ref.sources[0].url);
    } else {
        return symbol;
    }
}

const PARENT_TYPES = [
    ReflectionKind.CallSignature, ReflectionKind.ConstructorSignature,
    ReflectionKind.GetSignature, ReflectionKind.SetSignature,
];

const PROTECTED_SYMBOL = '~';
const PRIVATE_SYMBOL = '-';
const PUBLIC_SYMBOL = '+';
