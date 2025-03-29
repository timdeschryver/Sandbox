import * as v from 'valibot';

export const CustomerOverview = v.strictObject({
	id: v.number(),
	firstName: v.string(),
	lastName: v.string(),
});
export type CustomerOverview = v.InferOutput<typeof CustomerOverview>;

export const BillingAddressRequest = v.strictObject({
	street: v.string(),
	city: v.string(),
	zipCode: v.string(),
});
export type BillingAddressRequest = v.InferOutput<typeof BillingAddressRequest>;

export const ShippingAddressRequest = v.strictObject({
	street: v.string(),
	city: v.string(),
	zipCode: v.string(),
	note: v.optional(v.string()),
});
export type ShippingAddressRequest = v.InferOutput<typeof ShippingAddressRequest>;

export const CreateCustomerRequest = v.strictObject({
	firstName: v.string(),
	lastName: v.string(),
	billingAddress: v.nullable(BillingAddressRequest),
	shippingAddress: v.nullable(ShippingAddressRequest),
});
export type CreateCustomerRequest = v.InferOutput<typeof CreateCustomerRequest>;

export const Address = v.strictObject({
	street: v.string(),
	city: v.string(),
	zipCode: v.string(),
});
export type Address = v.InferOutput<typeof Address>;

export const ShippingAddress = v.strictObject({
	...Address.entries,
	id: v.number(),
	note: v.optional(v.string()),
});
export type ShippingAddress = v.InferOutput<typeof ShippingAddress>;

export const BillingAddress = v.strictObject({
	...Address.entries,
	id: v.number(),
});
export type BillingAddress = v.InferOutput<typeof BillingAddress>;

export const CustomerDetails = v.strictObject({
	id: v.number(),
	firstName: v.string(),
	lastName: v.string(),
	billingAddress: v.array(BillingAddress),
	shippingAddress: v.array(ShippingAddress),
});
export type CustomerDetails = v.InferOutput<typeof CustomerDetails>;
