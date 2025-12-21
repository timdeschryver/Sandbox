import { getConfig } from './utils/env';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function globalSetup() {
	const config = getConfig();
	const databaseUrl = config.databaseUrl;

	if (!databaseUrl) {
		console.warn('⚠ Database migrations service URL not found, skipping database reset');
		return;
	}

	const reseedUrl = `${databaseUrl}/reseed-db`;

	console.log(`Resetting database via ${reseedUrl}...`);

	try {
		const response = await fetch(reseedUrl, {
			method: 'POST',
		});

		if (!response.ok) {
			throw new Error(`⚠️ Database reset failed with status ${response.status}: ${response.statusText}`);
		}

		console.log('✅ Database reset completed successfully');
	} catch (error) {
		console.error('❌ Failed to reset database:', error);
		throw error;
	}
}

export default globalSetup;
