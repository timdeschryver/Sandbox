export * from './validation-messages.token';
export * from './validation-message.pipe';
export * from './control-error';
export * from './error';

import { ControlError } from './control-error';
import { Error } from './error';
import { ValidationMessagePipe } from './validation-message.pipe';

export const formValidation = [ControlError, Error, ValidationMessagePipe];
