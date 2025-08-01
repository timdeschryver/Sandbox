import { expect, it } from 'vitest';
import { generateUuid } from './generation';

it('generates a valid uuid', () => {
	const uuid = generateUuid();
	expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

it('generates a random uuid', () => {
	const uuid = generateUuid();
	const uuid2 = generateUuid();

	expect(uuid).not.toBe(uuid2);
});
