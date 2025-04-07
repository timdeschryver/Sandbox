import * as v from 'valibot';
import { Address } from './address.model';

const ShippingAddress = v.strictObject({
	...Address.entries,
	id: v.number(),
	note: v.string(),
});
const BillingAddress = v.strictObject({
	...Address.entries,
	id: v.number(),
});

export const CustomerDetailsResponse = v.strictObject({
	id: v.number(),
	firstName: v.string(),
	lastName: v.string(),
	billingAddresses: v.array(BillingAddress),
	shippingAddresses: v.array(ShippingAddress),
});
export type CustomerDetailsResponse = v.InferOutput<typeof CustomerDetailsResponse>;
