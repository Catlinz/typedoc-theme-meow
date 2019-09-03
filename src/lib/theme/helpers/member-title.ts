import { DeclarationReflection } from 'typedoc';
import { heading } from './formatting-basic';

export function memberTitle(this: DeclarationReflection) {
  const md = [heading(3)];
  if (this.flags) {
    md.push(this.flags.map(flag => `\`${flag}\``).join(' '));
  }
  md.push(this.name);
  return md.join(' ');
}
