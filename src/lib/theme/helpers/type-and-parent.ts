import { ArrayType, ReferenceType } from 'typedoc/dist/lib/models/types';
import { SignatureReflection } from 'typedoc';

import { properURL, formatURLStr } from './formatting-basic';
import { DOT_STR, TYPE_VOID } from './constants';

export function typeAndParent(this: ArrayType | ReferenceType) {
  if (this instanceof ReferenceType && this.reflection) {
    const md = [];
    if (this.reflection instanceof SignatureReflection) {
      if (this.reflection.parent.parent.url) {
        md.push(formatURLStr(this.reflection.parent.parent.name, properURL(this.reflection.parent.parent.url)));
      } else {
        md.push(this.reflection.parent.parent.name);
      }
    } else {
      if (this.reflection.parent.url) {
        md.push(formatURLStr(this.reflection.parent.name, properURL(this.reflection.parent.url)));
      } else {
        md.push(this.reflection.parent.name);
      }
      if (this.reflection.url) {
        md.push(formatURLStr(this.reflection.name, properURL(this.reflection.url)));
      } else {
        md.push(this.reflection.name);
      }
    }
    return md.join(DOT_STR);
  }
  return TYPE_VOID;
}
