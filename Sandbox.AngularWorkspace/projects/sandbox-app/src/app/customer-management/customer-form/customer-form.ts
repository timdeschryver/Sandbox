import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import {
	Control,
	type OneOrMany,
	type ValidationError,
	type WithOptionalField,
	applyWhen,
	form,
	hidden,
	minLength,
	required,
	schema,
	submit,
} from '@angular/forms/signals';
import { type Address, type CustomerId } from '@sandbox-app/customer-management/models';
import { Customers } from '@sandbox-app/customer-management/customer-management';
import { CustomerAddress } from '@sandbox-app/customer-management/shared/customer-address/customer-address';
import { HttpErrorResponse } from '@angular/common/http';
import { type Observable, catchError, firstValueFrom, map, of } from 'rxjs';
import { formValidation } from '@form-validation';

@Component({
	selector: 'sandbox-customer-form',
	imports: [Control, CustomerAddress, formValidation],
	templateUrl: './customer-form.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerForm {
	private readonly customersService = inject(Customers);

	public readonly customerCreated = output<CustomerId>();

	protected readonly customerForm = form(signal<CustomerFormModel>(this.initializeCustomerModel()), (path) => {
		required(path.firstName);
		required(path.lastName);

		hidden(path.billingAddress, (logic) => !logic.valueOf(path.hasBillingAddress));
		applyWhen(path.billingAddress, (logic) => logic.valueOf(path.hasBillingAddress), addressSchema);

		hidden(path.shippingAddress, (logic) => !logic.valueOf(path.hasShippingAddress));
		applyWhen(path.shippingAddress, (logic) => logic.valueOf(path.hasShippingAddress), addressSchema);
		minLength(path.shippingAddress.note, (logic) => {
			return logic.value() ? 10 : 0;
		});
	});

	protected async onSubmit(event: Event): Promise<void> {
		event.preventDefault();

		await submit(this.customerForm, async (form) => {
			if (this.customerForm().invalid()) {
				return;
			}

			const formValue = form().value();
			return await firstValueFrom(
				this.customersService
					.createCustomer({
						firstName: formValue.firstName,
						lastName: formValue.lastName,
						billingAddress: formValue.hasBillingAddress
							? {
									city: formValue.billingAddress.city,
									street: formValue.billingAddress.street,
									zipCode: formValue.billingAddress.zipCode,
								}
							: null,
						shippingAddress: formValue.hasShippingAddress
							? {
									city: formValue.shippingAddress.city,
									street: formValue.shippingAddress.street,
									zipCode: formValue.shippingAddress.zipCode,
									note: formValue.shippingAddress.note ? formValue.shippingAddress.note : null,
								}
							: null,
					})
					.pipe(
						map((customerId) => {
							form().reset();
							form().value.set(this.initializeCustomerModel());
							this.customerCreated.emit(customerId);
							return null;
						}),
						catchError((error: unknown): Observable<OneOrMany<WithOptionalField<ValidationError>>> => {
							return of({
								kind: 'server',
								message:
									error instanceof HttpErrorResponse && this.isErrorWithTitle(error.error)
										? error.error.title
										: 'An unexpected error occurred, please try again.',
							});
						}),
					),
			);
		});
	}

	private isErrorWithTitle(error: unknown): error is { title: string } {
		return typeof error === 'object' && error !== null && typeof (error as { title: unknown }).title === 'string';
	}

	private initializeCustomerModel(): CustomerFormModel {
		return {
			firstName: '',
			lastName: '',
			hasBillingAddress: false,
			billingAddress: {
				city: '',
				street: '',
				zipCode: '',
			},
			hasShippingAddress: false,
			shippingAddress: {
				city: '',
				street: '',
				zipCode: '',
				note: '',
			},
		};
	}
}

const addressSchema = schema<Address>((path) => {
	required(path.street);
	minLength(path.street, 3);
	required(path.city);
	minLength(path.city, 3);
	required(path.zipCode);
	minLength(path.zipCode, 3);
});

interface CustomerFormModel {
	firstName: string;
	lastName: string;
	hasBillingAddress: boolean;
	billingAddress: {
		street: string;
		city: string;
		zipCode: string;
	};
	hasShippingAddress: boolean;
	shippingAddress: {
		street: string;
		city: string;
		zipCode: string;
		note: string;
	};
}
