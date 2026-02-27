import { describe, expect, it } from 'vitest';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FeatureFlags } from './feature-flags';

describe('FeatureFlags', () => {
	it('loads feature flags from BFF endpoint', async () => {
		const { service, mockRequest } = setup();
		await mockRequest([
			{ key: 'billing-enabled', enabled: true },
			{ key: 'customer-export', enabled: false },
		]);

		expect(service.flags()).toHaveLength(2);
	});

	it('isEnabled returns true for enabled flag', async () => {
		const { service, mockRequest } = setup();
		await mockRequest([{ key: 'billing-enabled', enabled: true }]);

		expect(service.isEnabled('billing-enabled')).toBe(true);
	});

	it('isEnabled returns false for disabled flag', async () => {
		const { service, mockRequest } = setup();
		await mockRequest([{ key: 'customer-export', enabled: false }]);

		expect(service.isEnabled('customer-export')).toBe(false);
	});

	it('isEnabled returns false for unknown flag', async () => {
		const { service, mockRequest } = setup();
		await mockRequest([]);

		expect(service.isEnabled('nonexistent-flag')).toBe(false);
	});
});

function setup() {
	const service = TestBed.inject(FeatureFlags);
	const mock = TestBed.inject(HttpTestingController);

	return {
		service,
		mockRequest: async (response: object) => {
			const request = mock.expectOne('/bff/feature-flags');
			request.flush(response);

			await Promise.resolve();
		},
	};
}
