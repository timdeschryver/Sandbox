export interface CustomerOverview {
	id: number;
	firstName: string;
	lastName: string;
}

export interface BillingAddressRequest {
	street: string;
	city: string;
	zipCode: string;
}

export interface ShippingAddressRequest {
	street: string;
	city: string;
	zipCode: string;
	note?: string;
}

export interface CreateCustomerRequest {
	firstName: string;
	lastName: string;
	billingAddress: BillingAddressRequest | null;
	shippingAddress: ShippingAddressRequest | null;
}

export interface Address {
	id: number;
	street: string;
	city: string;
	zipCode: string;
}

export interface ShippingAddress extends Address {
	note?: string;
}

export interface BillingAddress extends Address {}

export interface CustomerDetails {
	id: number;
	firstName: string;
	lastName: string;
	billingAddress: BillingAddress[];
	shippingAddress: ShippingAddress[];
}
