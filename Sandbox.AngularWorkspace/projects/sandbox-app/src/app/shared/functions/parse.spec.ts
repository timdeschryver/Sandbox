import { expect, it } from 'vitest';
import * as v from 'valibot';
import { parse, parseCollection } from './parse';

it('parses valid data correctly', () => {
	const schema = v.object({ id: v.number() });
	const parseData = parse(schema);
	const data = { id: 1 };

	expect(parseData(data)).toEqual(data);
});

it('throws error for invalid data', () => {
	const schema = v.object({ id: v.number() });
	const parseData = parse(schema);
	const invalidData = { id: '1' };

	expect(() => parseData(invalidData)).toThrow();
});

it('parses collection of valid items', () => {
	const schema = v.object({ id: v.number() });
	const parseItems = parseCollection(schema);
	const items = [{ id: 1 }, { id: 2 }];

	expect(parseItems(items)).toEqual(items);
});

it('throws error for invalid collection', () => {
	const schema = v.object({ id: v.number() });
	const parseItems = parseCollection(schema);

	expect(() => parseItems('not-an-array')).toThrow();
	expect(() => parseItems([{ id: '1' }])).toThrow();
});
