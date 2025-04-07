import * as v from 'valibot';

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
