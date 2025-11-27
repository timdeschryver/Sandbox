/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-empty-function */
import { expect, it, vi } from 'vitest';
import * as z from 'zod/mini';
import { parse, parseCollection } from './parse';

it('parses valid data correctly', () => {
	const schema = z.object({ id: z.number() });
	const parseData = parse(schema);
	const data = { id: 1 };

	expect(parseData(data)).toEqual(data);
});

it('throws error for invalid data', () => {
	const schema = z.object({ id: z.number() });
	const parseData = parse(schema);
	const invalidData = { id: '1' };
	const consoleSpy = vi.spyOn(console, 'error').mockImplementationOnce(() => {});

	expect(() => parseData(invalidData)).toThrow();
	expect(consoleSpy).toHaveBeenCalledTimes(1);

	consoleSpy.mockRestore();
});

it('parse logs error in development mode', () => {
	const originalNgDevMode = (globalThis as any).ngDevMode;
	(globalThis as any).ngDevMode = true;
	const consoleSpy = vi.spyOn(console, 'error').mockImplementationOnce(() => {});

	const idSchema = z.number();
	const parseId = parse(idSchema);
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

it('parse does not log error in production mode', () => {
	const originalNgDevMode = (globalThis as any).ngDevMode;
	(globalThis as any).ngDevMode = false;
	const consoleSpy = vi.spyOn(console, 'error').mockImplementationOnce(() => {});

	const idSchema = z.number();
	const parseId = parse(idSchema);
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

it('parses collection of valid items', () => {
	const schema = z.object({ id: z.number() });
	const parseItems = parseCollection(schema);
	const items = [{ id: 1 }, { id: 2 }];

	expect(parseItems(items)).toEqual(items);
});

it('throws error for invalid collection', () => {
	const schema = z.object({ id: z.number() });
	const parseItems = parseCollection(schema);
	const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

	expect(() => parseItems('not-an-array')).toThrow();
	expect(() => parseItems([{ id: '1' }])).toThrow();
	expect(consoleSpy).toHaveBeenCalledTimes(2);

	consoleSpy.mockRestore();
});

it('parse collection logs error in development mode', () => {
	const originalNgDevMode = (globalThis as any).ngDevMode;
	(globalThis as any).ngDevMode = true;
	const consoleSpy = vi.spyOn(console, 'error').mockImplementationOnce(() => {});

	const idSchema = z.array(z.number());
	const parseId = parse(idSchema);
	const invalidInput = ['abc'];

	try {
		parseId(invalidInput);
		expect.fail('Should have thrown an error');
	} catch {
		expect(consoleSpy).toHaveBeenCalledWith('Validation error:', expect.any(Object));
	}

	consoleSpy.mockRestore();
	(globalThis as any).ngDevMode = originalNgDevMode;
});

it('parse collection does not log error in production mode', () => {
	const originalNgDevMode = (globalThis as any).ngDevMode;
	(globalThis as any).ngDevMode = false;
	const consoleSpy = vi.spyOn(console, 'error').mockImplementationOnce(() => {});

	const idSchema = z.array(z.number());
	const parseId = parse(idSchema);
	const invalidInput = ['abc'];

	try {
		parseId(invalidInput);
		expect.fail('Should have thrown an error');
	} catch {
		expect(consoleSpy).not.toHaveBeenCalled();
	}

	consoleSpy.mockRestore();
	(globalThis as any).ngDevMode = originalNgDevMode;
});
