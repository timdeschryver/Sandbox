import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PeopleService } from './people.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-people',
	templateUrl: './people.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DatePipe],
})
export class PeopleComponent {
	private readonly peopleService = inject(PeopleService);

	protected readonly people = rxResource({
		loader: () => this.peopleService.get(),
	});

	protected refresh() {
		this.people.reload();
	}
}
