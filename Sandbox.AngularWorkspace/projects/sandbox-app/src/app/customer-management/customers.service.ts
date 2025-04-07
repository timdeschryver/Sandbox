import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, HttpResourceRef, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { parse, parseCollection } from '@sandbox-app/shared/functions/parse';
import {
	CreateCustomerCommand,
	CustomerDetailsResponse,
	CustomerOverviewResponse,
} from '@sandbox-app/customer-management/models';

@Injectable({
	providedIn: 'root',
})
export class CustomersService {
	private http = inject(HttpClient);

	public getOverview(): HttpResourceRef<CustomerOverviewResponse[] | undefined> {
		return httpResource(() => '/api/customers', {
			parse: parseCollection(CustomerOverviewResponse),
		});
	}

	public getCustomerDetails(id: Signal<number>): HttpResourceRef<CustomerDetailsResponse | undefined> {
		return httpResource(
			() => ({
				url: `/api/customers/${id().toString()}`,
			}),
			{
				parse: parse(CustomerDetailsResponse),
			},
		);
	}

	public createCustomer(customer: CreateCustomerCommand): Observable<number> {
		return this.http.post<number>('/api/customers', customer);
	}
}
