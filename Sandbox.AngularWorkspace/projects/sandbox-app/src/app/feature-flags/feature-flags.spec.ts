import { expect, it } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FeatureFlags } from './feature-flags';

it('returns all loaded feature flags', () => {
	const { service } = setup([
		{ key: 'billing-enabled', enabled: true },
		{ key: 'customer-export', enabled: false },
	]);
	expect(service.flags()).toHaveLength(2);
});

it('isEnabled returns true for enabled flag', () => {
	const { service } = setup([{ key: 'billing-enabled', enabled: true }]);
	expect(service.isEnabled('billing-enabled')).toBe(true);
});

it('isEnabled returns false for disabled flag', () => {
	const { service } = setup([{ key: 'customer-export', enabled: false }]);
	expect(service.isEnabled('customer-export')).toBe(false);
});

it('isEnabled returns false for unknown flag', () => {
	const { service } = setup([]);
	expect(service.isEnabled('nonexistent-flag')).toBe(false);
});

function createFeatureFlagsMock(flags: { key: string; enabled: boolean }[]) {
	return {
		flags: signal(flags),
		isLoaded: signal(true),
		isEnabled: (key: string) => flags.some((f) => f.key === key && f.enabled),
	};
}

function setup(flags: { key: string; enabled: boolean }[]) {
	const featureFlagsMock = createFeatureFlagsMock(flags);

	TestBed.configureTestingModule({
		providers: [
			{
				provide: FeatureFlags,
				useValue: featureFlagsMock,
			},
		],
	});

	const service = TestBed.runInInjectionContext(() => {
		return TestBed.inject(FeatureFlags);
	});
	return { service };
}
