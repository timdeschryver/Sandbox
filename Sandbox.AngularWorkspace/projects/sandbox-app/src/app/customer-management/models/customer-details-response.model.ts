import * as z from '@zod/mini';
import { Address } from './address.model';
import { CustomerAddressId, CustomerId } from './strongly-typed-ids.model';

const ShippingAddress = z.strictObject({
	...Address.def.shape,
	id: CustomerAddressId,
	note: z.string(),
});
const BillingAddress = z.strictObject({
	...Address.def.shape,
	id: CustomerAddressId,
});

export const CustomerDetailsResponse = z.strictObject({
	id: CustomerId,
	firstName: z.string(),
	lastName: z.string(),
	billingAddresses: z.array(BillingAddress),
	shippingAddresses: z.array(ShippingAddress),
});
export type CustomerDetailsResponse = z.infer<typeof CustomerDetailsResponse>;
