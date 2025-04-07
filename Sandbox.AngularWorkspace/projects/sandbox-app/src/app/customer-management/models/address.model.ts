import * as v from 'valibot';

export const Address = v.strictObject({
	street: v.string(),
	city: v.string(),
	zipCode: v.string(),
});
export type Address = v.InferOutput<typeof Address>;
