import { Injectable, Signal, inject } from '@angular/core';
import { CreateCustomerRequest, CustomerDetails, CustomerOverview } from '@/customers/customer.model';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CustomersService {
	private http = inject(HttpClient);

	public getOverview(): HttpResourceRef<CustomerOverview[] | undefined> {
		return httpResource<CustomerOverview[]>('/api/customers');
	}

	public getCustomerDetails(id: Signal<number>): HttpResourceRef<CustomerDetails | undefined> {
		return httpResource<CustomerDetails>(() => ({
			url: `/api/customers/${id()}`,
		}));
	}

	public createCustomer(customer: CreateCustomerRequest): Observable<unknown> {
		return this.http.post<unknown>('/api/customers', customer);
	}
}
