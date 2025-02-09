import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from './people.model';

@Injectable({
	providedIn: 'root',
})
export class PeopleService {
	private readonly http = inject(HttpClient);

	get(): Observable<Person[]> {
		return this.http.get<Person[]>('/api/people');
	}
}
