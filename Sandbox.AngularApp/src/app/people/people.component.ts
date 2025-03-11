import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Person } from './people.model';
import { PeopleService } from './people.service';
import { httpResource } from '@angular/common/http';

@Component({
	selector: 'app-people',
	templateUrl: './people.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DatePipe, FormsModule],
})
export default class PeopleComponent {
	private readonly peopleService = inject(PeopleService);

	protected readonly newPerson: Omit<Person, 'id'> = {
		firstName: '',
		lastName: '',
		email: '',
		dateOfBirth: '',
	};

	protected readonly people = httpResource<Person[]>('api/people');

	protected refresh() {
		this.people.reload();
	}

	protected onSubmit(personForm: NgForm) {
		if (personForm.invalid) {
			personForm.form.markAllAsTouched();
			return;
		}

		this.peopleService.create(this.newPerson).subscribe({
			next: () => {
				personForm.resetForm();
				this.refresh();
			},
			error: () => {
				alert('Failed to create person, please try again.');
			},
		});
	}
}
