import * as v from 'valibot';

export const User = v.strictObject({
	isAuthenticated: v.boolean(),
	name: v.nullable(v.string()),
	claims: v.array(
		v.strictObject({
			type: v.string(),
			value: v.string(),
		}),
	),
});
export type User = v.InferOutput<typeof User>;
