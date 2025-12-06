import { getConfig } from './utils/env';

async function globalSetup() {
	const config = getConfig();
	const databaseUrl = config.databaseUrl;

	if (!databaseUrl) {
		console.warn('⚠ Database migrations service URL not found, skipping database reset');
		return;
	}

	const resetUrl = `${databaseUrl}/reset-db`;

	console.log(`Resetting database via ${resetUrl}...`);

	try {
		const response = await fetch(resetUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
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
