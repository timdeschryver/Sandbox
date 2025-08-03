import * as z from 'zod/mini';

export const User = z.strictObject({
	isAuthenticated: z.boolean(),
	name: z.nullable(z.string()),
	claims: z.array(
		z.strictObject({
			type: z.string(),
			value: z.string(),
		}),
	),
});
export type User = z.infer<typeof User>;
