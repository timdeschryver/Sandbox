import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, HttpResourceRef, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { parse, parseCollection } from '@sandbox-app/shared/functions';
import {
	CreateCustomerCommand,
	CustomerDetailsResponse,
	CustomerId,
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

	public getCustomerDetails(id: Signal<CustomerId>): HttpResourceRef<CustomerDetailsResponse | undefined> {
		return httpResource(
			() => ({
				url: `/api/customers/${id().toString()}`,
			}),
			{
				parse: parse(CustomerDetailsResponse),
			},
		);
	}

	public createCustomer(customer: CreateCustomerCommand): Observable<CustomerId> {
		return this.http.post<CustomerId>('/api/customers', customer);
	}

	public deleteCustomer(id: CustomerId): Observable<void> {
		return this.http.delete<void>(`/api/customers/${id.toString()}`);
	}
}
