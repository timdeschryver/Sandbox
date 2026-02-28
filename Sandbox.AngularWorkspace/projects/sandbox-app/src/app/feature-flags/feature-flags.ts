import { httpResource } from '@angular/common/http';
import { Injectable, computed } from '@angular/core';
import { FeatureFlag } from '@sandbox-app/feature-flags/feature-flag';
import { parseCollection } from '@sandbox-app/shared/functions';

@Injectable({
	providedIn: 'root',
})
export class FeatureFlags {
	private _flags = httpResource(() => '/bff/feature-flags', {
		parse: parseCollection(FeatureFlag),
	}).asReadonly();

	public readonly flags = computed(() => this._flags.value() ?? []);
	public readonly isLoaded = computed(() => !this._flags.isLoading());

	public isEnabled(flagKey: string): boolean {
		return this.flags().some((flag) => flag.key === flagKey && flag.enabled);
	}
}
