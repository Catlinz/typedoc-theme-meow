import { ParameterReflection } from 'typedoc';

import { stripLineBreaks } from './formatting-basic';
import { parseCommentText } from './reflection-comment';
import { type } from './type';

export function parameterTable(this: ParameterReflection[]) {
  const defaultValues = this.map(param => !!param.defaultValue);
  const hasDefaultValues = !defaultValues.every(value => !value);

  const comments = this.map(
    param => (param.comment && !!param.comment.text) || (param.comment && !!param.comment.shortText),
  );
  const hasComments = !comments.every(value => !value);

  const headers = ['Name', 'Type'];

  if (hasDefaultValues) {
    headers.push('Default');
  }

  if (hasComments) {
    headers.push('Description');
  }

  const rows = this.map(parameter => {
    const isOptional = parameter.flags.includes('Optional');
    const typeOut = getTypeOut(parameter);

    const row = [
      `\`${parameter.flags.isRest ? '...' : ''}${parameter.name}${isOptional ? '?' : ''}\``,
      typeOut,
    ];
    if (hasDefaultValues) {
      row.push(parameter.defaultValue ? parameter.defaultValue : '-');
    }
    if (hasComments) {
      const commentsText = [];
      if (parameter.comment && parameter.comment.shortText) {
        commentsText.push(parseCommentText.call(stripLineBreaks.call(parameter.comment.shortText), false));
      }
      if (parameter.comment && parameter.comment.text) {
        commentsText.push(parseCommentText.call(stripLineBreaks.call(parameter.comment.text), false));
      }
      row.push(commentsText.length > 0 ? commentsText.join(' ') : '-');
    }
    return `${row.join(' | ')} |\n`;
  });

  const output = `\n${headers.join(' | ')} |\n${headers.map(() => '------').join(' | ')} |\n${rows.join('')}`;

  return output;
}

function getTypeOut(parameter: ParameterReflection): string {
    const typeOut = type.call(parameter.type).toString();
    return typeOut.replace(/\|/g, '\\|');
}
