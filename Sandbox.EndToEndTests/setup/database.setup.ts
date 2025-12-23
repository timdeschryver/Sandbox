import { expect, test } from '@playwright/test';
import { getConfig } from '../utils/env';

test('reseed database', async ({}) => {
	const config = getConfig();
	const databaseUrl = config.databaseUrl;
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

	test.fail(!databaseUrl, 'Database migrations service URL not found, skipping database reset');

	const reseedUrl = `${databaseUrl}/reseed-db`;

	console.log(`Resetting database via ${reseedUrl}...`);

	try {
		const response = await fetch(reseedUrl, {
			method: 'POST',
		});

		test.fail(!response.ok, `Database reset failed with status ${response.status}: ${response.statusText}`);
		expect(response.ok).toBe(true);

		console.log('✅ Database reset completed successfully');
	} catch (error) {
		console.error('❌ Failed to reset database:', error);
		test.fail(true, error);
	}
});
