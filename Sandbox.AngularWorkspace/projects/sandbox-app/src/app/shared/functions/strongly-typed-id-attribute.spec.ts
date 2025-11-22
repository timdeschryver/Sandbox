/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-empty-function */
import { expect, it, vi } from 'vitest';
import * as z from 'zod/mini';
import { stronglyTypedIdAttribute } from './strongly-typed-id-attribute';
import { numberAttribute } from '@angular/core';

it('transforms and validates valid input', () => {
	const idSchema = z.number();
	const parseId = stronglyTypedIdAttribute(idSchema, numberAttribute);
	const validInput = '123';

	const result = parseId(validInput);

	expect(result).toBe(123);
});

it('throws error for invalid input', () => {
	const idSchema = z.number();
	const parseId = stronglyTypedIdAttribute(idSchema, numberAttribute);
	const invalidInput = 'abc';
	const consoleSpy = vi.spyOn(console, 'error').mockImplementationOnce(() => {});

	expect(() => parseId(invalidInput)).toThrow();

	expect(consoleSpy).toHaveBeenCalledWith('Validation error:', expect.any(Object));
});

it('logs error in development mode', () => {
	const originalNgDevMode = (globalThis as any).ngDevMode;
	(globalThis as any).ngDevMode = true;
	const consoleSpy = vi.spyOn(console, 'error').mockImplementationOnce(() => {});

	const idSchema = z.number();
	const parseId = stronglyTypedIdAttribute(idSchema, numberAttribute);
	const invalidInput = 'abc';

	try {
		parseId(invalidInput);
		expect.fail('Should have thrown an error');
	} catch {
		expect(consoleSpy).toHaveBeenCalledWith('Validation error:', expect.any(Object));
	}

	consoleSpy.mockRestore();
	(globalThis as any).ngDevMode = originalNgDevMode;
});

it('does not log error in production mode', () => {
	const originalNgDevMode = (globalThis as any).ngDevMode;
	(globalThis as any).ngDevMode = false;
	const consoleSpy = vi.spyOn(console, 'error').mockImplementationOnce(() => {});

	const idSchema = z.number();
	const parseId = stronglyTypedIdAttribute(idSchema, numberAttribute);
	const invalidInput = 'abc';

	try {
		parseId(invalidInput);
		expect.fail('Should have thrown an error');
	} catch {
		expect(consoleSpy).not.toHaveBeenCalled();
	}

	consoleSpy.mockRestore();
	(globalThis as any).ngDevMode = originalNgDevMode;
});
