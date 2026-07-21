import { HttpClient, type HttpResourceRef, httpResource } from '@angular/common/http';
import { Service, type Signal, inject } from '@angular/core';
import {
	type CreateCustomerCommand,
	CustomerDetailsResponse,
	type CustomerId,
	CustomerOverviewResponse,
} from '@sandbox-app/customer-management/models';
import { parse, parseCollection } from '@sandbox-app/shared/functions';
import { firstValueFrom } from 'rxjs';

@Service()
export class Customers {
	private http = inject(HttpClient);

	public getOverview(): HttpResourceRef<CustomerOverviewResponse[] | undefined> {
		return httpResource(() => '/api/customers', {
			parse: parseCollection(CustomerOverviewResponse),
		});
	}

	public getCustomerDetails(id: Signal<CustomerId>): HttpResourceRef<CustomerDetailsResponse | undefined> {
		return httpResource(
			() => ({
				url: `/api/customers/${id()}`,
			}),
			{
				parse: parse(CustomerDetailsResponse),
			},
		);
	}

	public createCustomer(customer: CreateCustomerCommand): Promise<CustomerId> {
		return firstValueFrom(this.http.post<CustomerId>('/api/customers', customer));
	}
}
