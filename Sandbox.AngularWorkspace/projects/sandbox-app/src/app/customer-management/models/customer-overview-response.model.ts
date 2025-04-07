import * as v from 'valibot';

export const CustomerOverviewResponse = v.strictObject({
	id: v.number(),
	firstName: v.string(),
	lastName: v.string(),
});
export type CustomerOverviewResponse = v.InferOutput<typeof CustomerOverviewResponse>;
