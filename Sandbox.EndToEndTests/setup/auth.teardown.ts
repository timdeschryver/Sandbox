import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';

const storageState = '.state/auth-state.json';

test('cleanup auth state', async () => {
	try {
		fs.unlinkSync(storageState);
	} catch {
		// File might not exist, which is fine
	}

	expect(fs.existsSync(storageState)).toBe(false);
});
