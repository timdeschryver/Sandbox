import * as z from 'zod/mini';

export const FeatureFlag = z.strictObject({
	key: z.string(),
	enabled: z.boolean(),
});
export type FeatureFlag = z.infer<typeof FeatureFlag>;
