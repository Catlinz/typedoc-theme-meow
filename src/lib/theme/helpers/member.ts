import { DeclarationReflection, ReflectionKind, Reflection, ContainerReflection } from 'typedoc';
import { heading, formatURLStr } from './formatting-basic';
import { shouldShowMemberTitle } from './should';
import { DBL_NEWLINE, SPACE_STR, TICK_STR } from './constants';

export function member(this: DeclarationReflection, headingLevel?: number): string {
    const lines: string[] = [];
    const signature = (require('./reflection-signature') as typeof import('./reflection-signature')).signature;

    if (shouldShowMemberTitle(this)) {
        lines.push(memberTitle(this, headingLevel));
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
    else if (!is_event_private_member(this)) {

        const declaration = (require('./reflection-declaration') as typeof import('./reflection-declaration')).declaration;
        lines.push(declaration(this, 4));
    }

    return lines.join(DBL_NEWLINE);
}

export function memberTitle(ref: DeclarationReflection, headingLevel?: number): string {
  const md = [heading(headingLevel)];
  if (ref.flags) {
    md.push(ref.flags.map(flag => TICK_STR+flag+TICK_STR).join(SPACE_STR));
  }
  md.push(ref.name);
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

export function is_event_private_member(ref: DeclarationReflection): boolean {
    if (!ref || !ref.parent || !ref.flags || !(ref.flags.isPrivate || ref.flags.isProtected)) {
        return false;
    }

    const parent = (ref.parent as ContainerReflection);
    const testName = ref.name.substr(1);
    
    for (const child of parent.children) {
        if (child.kind === ReflectionKind.Event && child.name === testName) {
            return true;
        }
    }

    return false;
}

const PARENT_TYPES = [
    ReflectionKind.CallSignature, ReflectionKind.ConstructorSignature,
    ReflectionKind.GetSignature, ReflectionKind.SetSignature,
];

const PROTECTED_SYMBOL = '~';
const PRIVATE_SYMBOL = '-';
const PUBLIC_SYMBOL = '+';
