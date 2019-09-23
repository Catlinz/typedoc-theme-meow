import { Type } from 'typedoc/dist/lib/models';
import { ParameterReflection } from 'typedoc';

import { TABLE_COL_NAME, TABLE_COL_TYPE, TABLE_COL_DEFAULT, TABLE_COL_DESC, TICK_STR, THREE_DOTS, EMPTY_STR, QUESTION_STR, DASH_STR, SPACE_STR, PIPE_SPACED, NEWLINE, TYPE_STRING } from './constants';
import { parseCommentText } from './reflection-comment';
import { stripLineBreaks } from './formatting-basic';
import { type } from './type';

export function parameterTable(ref: ParameterReflection[]) {
    const hasDefaultValues = ref.some(boolCheck);
    const hasComments = ref.some(commentCheck);

    const headers = [TABLE_COL_NAME, TABLE_COL_TYPE];

    if (hasDefaultValues) { headers.push(TABLE_COL_DEFAULT); }
    if (hasComments) { headers.push(TABLE_COL_DESC); }

    const rows = ref.map(parameter => {
        const isOptional = parameter.flags.isOptional;
        const isRest = parameter.flags.isRest;
        const typeOut = getTypeOut(parameter);

        const row = [
            TICK_STR + (isRest ? THREE_DOTS : EMPTY_STR) + parameter.name + (isOptional ? QUESTION_STR : EMPTY_STR) + TICK_STR,
            typeOut,
        ];
        if (hasDefaultValues) {
            row.push(parameter.defaultValue ? parameter.defaultValue : DASH_STR);
        }
        if (hasComments) {
            const commentsText = [];
            if (parameter.comment && parameter.comment.shortText) {
                commentsText.push(parseCommentText(stripLineBreaks(parameter.comment.shortText), false));
            }
            if (parameter.comment && parameter.comment.text) {
                commentsText.push(parseCommentText(stripLineBreaks(parameter.comment.text), false));
            }
            row.push(commentsText.length > 0 ? commentsText.join(SPACE_STR) : DASH_STR);
        }
        return row.join(PIPE_SPACED) + TABLE_SEP;
    });

    const output = NEWLINE + headers.join(PIPE_SPACED) + TABLE_SEP + headers.map(() => TABLE_HEADER).join(PIPE_SPACED) + TABLE_SEP + rows.join(EMPTY_STR);

    return output;
}

function getTypeOut(parameter: ParameterReflection): string {
    let typeOut = type.call(parameter.type) as string|Type;

    if (typeof typeOut !== TYPE_STRING) {
        typeOut = typeOut.toString();
    }
    return (typeOut as string).replace(ESCAPE_PIPE_RE, ESCAPE_PIPE);
}

const TABLE_HEADER = '------';

const TABLE_SEP = ' |\n';
const ESCAPE_PIPE = '\\|';

const ESCAPE_PIPE_RE = /\|/g;

const boolCheck = (it: ParameterReflection) => it.defaultValue;
const commentCheck = (it: ParameterReflection) => it.comment && (it.comment.text || it.comment.shortText);
