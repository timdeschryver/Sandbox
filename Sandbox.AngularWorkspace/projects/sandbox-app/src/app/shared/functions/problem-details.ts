import { HttpErrorResponse } from '@angular/common/http';
import { type FieldTree, type ValidationError } from '@angular/forms/signals';

export function mapHttpError(
	error: unknown,
	fieldMap: Partial<Record<string, FieldTree<unknown>>>,
): ValidationError.WithOptionalFieldTree | ValidationError.WithOptionalFieldTree[] {
	const body: unknown = error instanceof HttpErrorResponse ? error.error : undefined;
	if (isProblemDetails(body)) {
		return mapProblemDetailsToFormErrors(body, fieldMap);
	}
	return { kind: 'server', message: 'An unexpected error occurred, please try again.' };
}

export function isProblemDetails(error: unknown): error is ProblemDetails {
	return typeof error === 'object' && error !== null && typeof (error as ProblemDetails).title === 'string';
}

export function mapProblemDetailsToFormErrors(
	problemDetails: ProblemDetails,
	fieldMap: Partial<Record<string, FieldTree<unknown>>>,
): ValidationError.WithOptionalFieldTree | ValidationError.WithOptionalFieldTree[] {
	const fieldErrors = problemDetails.errors;
	if (!fieldErrors || Object.keys(fieldErrors).length === 0) {
		return { kind: 'server', message: problemDetails.title };
	}

	return Object.entries(fieldErrors).flatMap(([key, messages]) =>
		messages.map((message) => ({
			kind: 'server',
			message,
			fieldTree: fieldMap[key],
		})),
	);
}

interface ProblemDetails {
	title: string;
	status: number;
	errors?: Record<string, string[]>;
}
