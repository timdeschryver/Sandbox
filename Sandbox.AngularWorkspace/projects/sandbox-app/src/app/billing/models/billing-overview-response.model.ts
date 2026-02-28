import * as z from 'zod/mini';

export const BillingOverviewResponseSchema = z.strictObject({
	message: z.string(),
});
export type BillingOverviewResponse = z.infer<typeof BillingOverviewResponseSchema>;
