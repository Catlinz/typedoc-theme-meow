import { ReferenceType, Type } from 'typedoc/dist/lib/models/types';
import { SignatureReflection } from 'typedoc';

import { properURL, formatURLStr } from './formatting-basic';
import { DOT_STR, TYPE_VOID } from './constants';

export function typeAndParent(ref: Type) {
  if (ref instanceof ReferenceType && ref.reflection) {
    const md = [];
    if (ref.reflection instanceof SignatureReflection) {
      if (ref.reflection.parent.parent.url) {
        md.push(formatURLStr(ref.reflection.parent.parent.name, properURL(ref.reflection.parent.parent.url)));
      } else {
        md.push(ref.reflection.parent.parent.name);
      }
    } else {
      if (ref.reflection.parent.url) {
        md.push(formatURLStr(ref.reflection.parent.name, properURL(ref.reflection.parent.url)));
      } else {
        md.push(ref.reflection.parent.name);
      }
      if (ref.reflection.url) {
        md.push(formatURLStr(ref.reflection.name, properURL(ref.reflection.url)));
      } else {
        md.push(ref.reflection.name);
      }
    }
    return md.join(DOT_STR);
  }
  return TYPE_VOID;
}
