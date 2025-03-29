import { Injectable, Signal, inject } from '@angular/core';
import { CreateCustomerRequest, CustomerDetails, CustomerOverview } from '@/customers/customer.model';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { Observable } from 'rxjs';
import { parse, parseCollection } from '@/shared/functions/parse';

@Injectable({
	providedIn: 'root',
})
export class CustomersService {
	private http = inject(HttpClient);

	public getOverview(): HttpResourceRef<CustomerOverview[] | undefined> {
		return httpResource(() => '/api/customers', {
			parse: parseCollection(CustomerOverview),
		});
	}

	public getCustomerDetails(id: Signal<number>): HttpResourceRef<CustomerDetails | undefined> {
		return httpResource(
			() => ({
				url: `/api/customers/${id()}`,
			}),
			{
				parse: parse(CustomerDetails),
			},
		);
	}

	public createCustomer(customer: CreateCustomerRequest): Observable<unknown> {
		return this.http.post<unknown>('/api/customers', customer);
	}
}
