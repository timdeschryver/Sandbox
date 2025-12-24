import { Pipe, type PipeTransform, inject } from '@angular/core';
import { VALIDATION_MESSAGES, defaultValidationMessages } from './validation-messages.token';
import type { ValidationError } from '@angular/forms/signals';

@Pipe({
	name: 'validationMessage',
})
export class ValidationMessagePipe implements PipeTransform {
	private readonly messages = {
		...defaultValidationMessages,
		...inject(VALIDATION_MESSAGES, { optional: true }),
	};

	public transform(error: ValidationError.WithOptionalField | null | undefined, showFieldName = false): string {
		if (!error) {
			return '';
		}
		const message = error.message ?? (this.messages[error.kind] ?? this.messages['invalid'])(error);
		return showFieldName && error.fieldTree ? `${error.fieldTree().name()}: ${message}` : message;
	}
}
