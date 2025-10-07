export * from './validation-messages.token';
export * from './validation-message.pipe';
export * from './control-errors';
export * from './error';

import { ControlErrors } from './control-errors';
import { Error } from './error';
import { ValidationMessagePipe } from './validation-message.pipe';

export const formValidation = [ControlErrors, Error, ValidationMessagePipe];
