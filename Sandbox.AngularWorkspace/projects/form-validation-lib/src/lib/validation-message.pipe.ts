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

	public transform(error: ValidationError | null | undefined, showFieldName = false): string {
		if (!error) {
			return '';
		}
		const message = this.messages[error.kind] ?? this.messages['invalid'];
		return showFieldName ? `${error.field().name()}: ${message(error)}` : message(error);
	}
}
