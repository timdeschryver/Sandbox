import { InjectionToken } from '@angular/core';
import type {
	MaxLengthValidationError,
	MinLengthValidationError,
	RequiredValidationError,
} from '@angular/forms/signals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidationMessageFn<T = any> = (error: T) => string;

export const VALIDATION_MESSAGES = new InjectionToken<Record<string, ValidationMessageFn>>('VALIDATION_MESSAGES');

export const defaultValidationMessages: Record<string, ValidationMessageFn> = {
	invalid: () => 'Field is invalid',
	required: (_error: RequiredValidationError) => 'Field is required',
	email: () => 'Please enter a valid email',
	minLength: (error: MinLengthValidationError) => `Minimum length is ${error.minLength.toString()} characters`,
	maxLength: (error: MaxLengthValidationError) => `Maximum length is ${error.maxLength.toString()} characters`,
};
