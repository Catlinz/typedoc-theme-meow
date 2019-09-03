import { DeclarationReflection, ReflectionKind } from 'typedoc';

const PARENT_TYPES = [
    ReflectionKind.CallSignature, ReflectionKind.ConstructorSignature,
    ReflectionKind.GetSignature, ReflectionKind.SetSignature,
];

export function memberVisibilitySymbol(this: DeclarationReflection) {
    let symbol = '+';

    const flags = PARENT_TYPES.includes(this.kind) ? this.parent.flags : this.flags;

    if (flags.isProtected) { symbol = '~'; }
    if (flags.isPrivate) { symbol = '-'; }

    if (this.sources && this.sources.length) {
        return `[${symbol}](${this.sources[0].url})`;
    } else {
        return symbol;
    }
}
