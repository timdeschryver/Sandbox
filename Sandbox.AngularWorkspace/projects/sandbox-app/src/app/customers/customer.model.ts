import * as v from 'valibot';

export const CustomerOverview = v.strictObject({
	id: v.number(),
	firstName: v.string(),
	lastName: v.string(),
});
export type CustomerOverview = v.InferOutput<typeof CustomerOverview>;

export const CreateCustomerCommand = v.strictObject({
	firstName: v.string(),
	lastName: v.string(),
	billingAddress: v.nullable(
		v.strictObject({
			street: v.string(),
			city: v.string(),
			zipCode: v.string(),
		}),
	),
	shippingAddress: v.nullable(
		v.strictObject({
			street: v.string(),
			city: v.string(),
			zipCode: v.string(),
			note: v.optional(v.string()),
		}),
	),
});
export type CreateCustomerCommand = v.InferOutput<typeof CreateCustomerCommand>;

export const Address = v.strictObject({
	street: v.string(),
	city: v.string(),
	zipCode: v.string(),
});
export type Address = v.InferOutput<typeof Address>;

export const ShippingAddress = v.strictObject({
	...Address.entries,
	id: v.number(),
	note: v.string(),
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
	billingAddresses: v.array(BillingAddress),
	shippingAddresses: v.array(ShippingAddress),
});
export type CustomerDetails = v.InferOutput<typeof CustomerDetails>;
