import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { type CanMatchFn } from '@angular/router';
import { FeatureFlags } from '@sandbox-app/feature-flags/feature-flags';
import { filter, map, take } from 'rxjs';

export function featureFlagGuard(flagKey: string): ReturnType<CanMatchFn> {
	const featureFlags = inject(FeatureFlags);

	return toObservable(featureFlags.isLoaded).pipe(
		filter((loaded) => loaded),
		take(1),
		map(() => featureFlags.isEnabled(flagKey)),
	);
}
