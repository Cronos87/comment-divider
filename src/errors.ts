import { window, Selection, TextLine } from 'vscode';

import { EXT_NAME } from './constants';
import { IConfig, ILimiters } from './types';

///

export const ERRORS = {
  EMPTY_LINE: 'Line should contain at least one character!',
  MULTI_LINE: 'Selection should be on single line!',
  LONG_TEXT:
    'Too many characters! Increase divider length in settings or use less characters.',
  COMMENT_CHARS: 'Line contains comment characters!',
  FILLER_LEN: 'Incorrect filler symbol!'
};

/* --------------------------------- Helpers -------------------------------- */

const showErrorMsg = (msg: string) =>
  window.showInformationMessage(`${EXT_NAME}: ${msg}`);

const getMaxAllowedLen = (config: IConfig, indentLen: number = 0) => {
  const limitersLen = config.limiters.left.length + config.limiters.right.length;
  const gapsCount = 4;
  const minFillerCount = 2;
  return config.lineLen
    - limitersLen
    - gapsCount
    - minFillerCount
    - (config.fixLen ? indentLen : 0);
};

/* -------------------------------- Checkers -------------------------------- */

export const checkMultiLineSelection = (selection: Selection) => {
  if (!selection.isSingleLine) throw new Error('MULTI_LINE');
};

///

export const checkEmptyLine = (line: TextLine) => {
  if (line.isEmptyOrWhitespace) throw new Error('EMPTY_LINE');
};

///

export const checkCommentChars = (text: string, limiters: ILimiters) => {
  if (
    (limiters.left && text.includes(limiters.left)) ||
    (limiters.right && text.includes(limiters.right))
  )
    throw new Error('COMMENT_CHARS');
};

///

export const checkLongText = (text: string, config: IConfig, indentLen: number) => {
  const maxAllowedLen = getMaxAllowedLen(config, indentLen);
  if (text.length > maxAllowedLen) throw new Error('LONG_TEXT');
};

///

export const checkFillerLen = (fillerSym: string) => {
  if (fillerSym.length !== 1) throw new Error('FILLER_LEN');
};

/* --------------------------------- Handler -------------------------------- */

export const handleError = (e: Error) => {
  const errorMsg = ERRORS[e.message];
  if (errorMsg !== undefined) showErrorMsg(errorMsg);
};
