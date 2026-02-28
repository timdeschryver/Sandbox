import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BillingService } from '@sandbox-app/billing/billing.service';
import { Alert } from '@sandbox-app/shared/components/alert/alert';

@Component({
	selector: 'sandbox-billing-overview',
	imports: [Alert],
	templateUrl: './billing-overview.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BillingOverview {
	private readonly billingService = inject(BillingService);
	protected readonly billingOverviewResource = this.billingService.overview;
}
