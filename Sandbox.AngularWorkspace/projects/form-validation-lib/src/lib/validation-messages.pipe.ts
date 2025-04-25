import { Pipe, PipeTransform, inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { VALIDATION_MESSAGES, defaultValidationMessages } from './validation-messages.token';

@Pipe({
	name: 'validationMessages',
})
export class ValidationMessagesPipe implements PipeTransform {
	private readonly messages = {
		...defaultValidationMessages,
		...inject(VALIDATION_MESSAGES, { optional: true }),
	};

	public transform(errors: ValidationErrors | null | undefined): string {
		if (!errors) {
			return '';
		}

		const firstKey = Object.keys(errors)[0];
		const message = this.messages[firstKey] ?? this.messages['invalid'];

		return message(errors[firstKey]);
	}
}
