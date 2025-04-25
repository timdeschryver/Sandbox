import { InjectionToken } from '@angular/core';

export type ValidationMessageFn = (error: unknown) => string;

export const VALIDATION_MESSAGES = new InjectionToken<Record<string, ValidationMessageFn>>('VALIDATION_MESSAGES');

export const defaultValidationMessages: Record<string, ValidationMessageFn> = {
	invalid: () => 'Field is invalid',
	required: () => 'Field is required',
	email: () => 'Please enter a valid email',
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
	minlength: (error) => `Minimum length is ${(error as any).requiredLength.toString()} characters`,
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
	maxlength: (error) => `Maximum length is ${(error as any).requiredLength.toString()} characters`,
};
