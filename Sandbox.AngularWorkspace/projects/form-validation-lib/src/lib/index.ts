export * from './validation-messages.token';
export * from './validation-message.pipe';
export * from './field-errors';
export * from './error';

import { FieldErrors } from './field-errors';
import { Error } from './error';
import { ValidationMessagePipe } from './validation-message.pipe';

export const formValidation = [FieldErrors, Error, ValidationMessagePipe];
