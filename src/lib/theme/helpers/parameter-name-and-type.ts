import { ParameterReflection } from 'typedoc';
import { type } from './type';
import { TICK_STR, SPACE_STR, THREE_DOTS } from './constants';

export function parameterNameAndType(this: ParameterReflection, displaySymbol = true) {
  const md = [];
  if (displaySymbol) {
    md.push('▪');
  }
  if (this.flags && !this.flags.isRest) {
    md.push(this.flags.map(flag => TICK_STR+flag+TICK_STR+SPACE_STR));
  }
  md.push(`${this.flags.isRest ? THREE_DOTS : ''} **${this.name}**`);
  if (this.type) {
    md.push(`: *${type.call(this.type)}*`);
  }
  if (this.defaultValue) {
    md.push(`= ${this.defaultValue}`);
  }
  return md.join('');
}
