import * as z from 'zod/mini';

export const CreateCustomerCommand = z.strictObject({
	firstName: z.string(),
	lastName: z.string(),
	billingAddress: z.nullable(
		z.strictObject({
			street: z.string(),
			city: z.string(),
			zipCode: z.string(),
		}),
	),
	shippingAddress: z.nullable(
		z.strictObject({
			street: z.string(),
			city: z.string(),
			zipCode: z.string(),
			note: z.nullable(z.string()),
		}),
	),
});
export type CreateCustomerCommand = z.infer<typeof CreateCustomerCommand>;
