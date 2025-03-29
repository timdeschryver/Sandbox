import { generateUuid } from './generation';

it('generates a valid uuid', () => {
	const uuid = generateUuid();
	expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
