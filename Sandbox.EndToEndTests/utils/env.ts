import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface Config {
	gatewayUrl: string;
	username: string;
	password: string;
}

/**
 * Loads environment variables, creates configuration, and validates required values
 * @returns Validated configuration object
 * @throws Error if any required variables are missing
 */
export function getConfig(): Config {
	// Load environment variables from .env file
	dotenv.config({ path: `${__dirname}/../.env` });

	// Create configuration object
	const config: Config = {
		gatewayUrl: process.env.GATEWAY_URL || '',
		username: process.env.PLAYWRIGHT_USERNAME || '',
		password: process.env.PLAYWRIGHT_PASSWORD || '',
	};

	// Validate required environment variables
	const missing: string[] = [];

	if (!config.username) missing.push('PLAYWRIGHT_USERNAME');
	if (!config.password) missing.push('PLAYWRIGHT_PASSWORD');

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(', ')}\n` +
				'Please create a .env file based on .env.example and fill in the values.',
		);
	}

	return config;
}
