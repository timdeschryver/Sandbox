import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { isProblemDetails, mapHttpError, mapProblemDetailsToFormErrors } from './problem-details';

describe('isProblemDetails', () => {
	it('returns true for a valid problem details object', () => {
		const error = { title: 'Validation failed', status: 400 };
		expect(isProblemDetails(error)).toBe(true);
	});

	it('returns true when errors property is present', () => {
		const error = { title: 'Validation failed', status: 400, errors: { FirstName: ['Required'] } };
		expect(isProblemDetails(error)).toBe(true);
	});

	it('returns false for null', () => {
		expect(isProblemDetails(null)).toBe(false);
	});

	it('returns false for a string', () => {
		expect(isProblemDetails('error')).toBe(false);
	});

	it('returns false when title is missing', () => {
		expect(isProblemDetails({ status: 400 })).toBe(false);
	});

	it('returns false when title is not a string', () => {
		expect(isProblemDetails({ title: 42, status: 400 })).toBe(false);
	});
});

describe('mapProblemDetailsToFormErrors', () => {
	it('returns a root error when errors is absent', () => {
		const result = mapProblemDetailsToFormErrors({ title: 'Something went wrong', status: 500 }, {});
		expect(result).toEqual({ kind: 'server', message: 'Something went wrong' });
	});

	it('returns a root error when errors is empty', () => {
		const result = mapProblemDetailsToFormErrors({ title: 'Something went wrong', status: 400, errors: {} }, {});
		expect(result).toEqual({ kind: 'server', message: 'Something went wrong' });
	});

	it('maps a single field error to its field tree', () => {
		const fieldTree = {} as never;
		const result = mapProblemDetailsToFormErrors(
			{ title: 'Validation failed', status: 400, errors: { FirstName: ['First name is required.'] } },
			{ FirstName: fieldTree },
		);
		expect(result).toEqual([{ kind: 'server', message: 'First name is required.', fieldTree }]);
	});

	it('maps multiple messages for a single field', () => {
		const fieldTree = {} as never;
		const result = mapProblemDetailsToFormErrors(
			{ title: 'Validation failed', status: 400, errors: { FirstName: ['Too short.', 'Required.'] } },
			{ FirstName: fieldTree },
		);
		expect(result).toEqual([
			{ kind: 'server', message: 'Too short.', fieldTree },
			{ kind: 'server', message: 'Required.', fieldTree },
		]);
	});

	it('maps multiple fields', () => {
		const firstNameTree = {} as never;
		const lastNameTree = {} as never;
		const result = mapProblemDetailsToFormErrors(
			{
				title: 'Validation failed',
				status: 400,
				errors: { FirstName: ['Required.'], LastName: ['Required.'] },
			},
			{ FirstName: firstNameTree, LastName: lastNameTree },
		);
		expect(result).toEqual([
			{ kind: 'server', message: 'Required.', fieldTree: firstNameTree },
			{ kind: 'server', message: 'Required.', fieldTree: lastNameTree },
		]);
	});

	it('sets fieldTree to undefined for unmapped keys', () => {
		const result = mapProblemDetailsToFormErrors(
			{ title: 'Validation failed', status: 400, errors: { UnknownField: ['Invalid.'] } },
			{},
		);
		expect(result).toEqual([{ kind: 'server', message: 'Invalid.', fieldTree: undefined }]);
	});
});

describe('mapHttpError', () => {
	it('returns a generic error for a non-HttpErrorResponse', () => {
		const result = mapHttpError(new Error('network failure'), {});
		expect(result).toEqual({ kind: 'server', message: 'An unexpected error occurred, please try again.' });
	});

	it('returns a generic error when response body is not problem details', () => {
		const response = new HttpErrorResponse({ error: 'plain string error', status: 500 });
		const result = mapHttpError(response, {});
		expect(result).toEqual({ kind: 'server', message: 'An unexpected error occurred, please try again.' });
	});

	it('maps field errors from a problem details response', () => {
		const fieldTree = {} as never;
		const response = new HttpErrorResponse({
			error: { title: 'Validation failed', status: 400, errors: { FirstName: ['Required.'] } },
			status: 400,
		});
		const result = mapHttpError(response, { FirstName: fieldTree });
		expect(result).toEqual([{ kind: 'server', message: 'Required.', fieldTree }]);
	});

	it('returns title as root error when problem details has no field errors', () => {
		const response = new HttpErrorResponse({
			error: { title: 'Internal server error', status: 500 },
			status: 500,
		});
		const result = mapHttpError(response, {});
		expect(result).toEqual({ kind: 'server', message: 'Internal server error' });
	});
});
