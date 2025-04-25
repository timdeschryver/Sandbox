export * from './validation-messages.token';
export * from './validation-messages.pipe';
export * from './control-error.component';
export * from './error.directive';
export * from './form-field.directive';

import { ControlErrorComponent } from './control-error.component';
import { ErrorDirective } from './error.directive';
import { FormFieldDirective } from './form-field.directive';
import { ValidationMessagesPipe } from './validation-messages.pipe';

export const formValidation = [ControlErrorComponent, ErrorDirective, FormFieldDirective, ValidationMessagesPipe];
