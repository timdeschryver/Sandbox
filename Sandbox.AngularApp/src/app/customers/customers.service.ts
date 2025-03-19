import { Injectable } from '@angular/core';
import { CustomerOverview } from './customer.model';
import { httpResource, HttpResourceRef } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class CustomersService {
	public getOverview(): HttpResourceRef<CustomerOverview[] | undefined> {
		return httpResource<CustomerOverview[]>('/api/customers');
	}
}
