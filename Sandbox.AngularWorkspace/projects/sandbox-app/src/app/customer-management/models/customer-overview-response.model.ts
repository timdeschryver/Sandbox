import * as z from 'zod/mini';
import { CustomerId } from './strongly-typed-ids.model';

export const CustomerOverviewResponse = z.strictObject({
	id: CustomerId,
	firstName: z.string(),
	lastName: z.string(),
});
export type CustomerOverviewResponse = z.infer<typeof CustomerOverviewResponse>;
