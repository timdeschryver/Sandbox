import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';
import { parse } from '@sandbox-app/shared/functions';

import { BillingOverviewResponseSchema } from './models/billing-overview-response.model';
import type { BillingOverviewResponse } from './models/billing-overview-response.model';

@Service()
export class BillingService {
	readonly overview = httpResource<BillingOverviewResponse>(() => '/api/billing', {
		parse: parse(BillingOverviewResponseSchema),
	});
}
