import { Injectable, inject } from '@angular/core';
import { CreateCustomerRequest, CustomerOverview } from '@/customers/customer.model';
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

	public createCustomer(customer: CreateCustomerRequest): Observable<unknown> {
		return this.http.post<unknown>('/api/customers', customer);
	}
}
