export * from './validation-messages.token';
export * from './validation-messages.pipe';
export * from './control-error';
export * from './error';
export * from './form-field';

import { ControlError } from './control-error';
import { Error } from './error';
import { FormField } from './form-field';
import { ValidationMessagesPipe } from './validation-messages.pipe';

export const formValidation = [ControlError, Error, FormField, ValidationMessagesPipe];
