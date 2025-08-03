import * as z from 'zod/mini';

export const Address = z.strictObject({
	street: z.string(),
	city: z.string(),
	zipCode: z.string(),
});
export type Address = z.infer<typeof Address>;
