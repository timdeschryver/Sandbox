namespace Sandbox.ApiService.CustomerModule;

public class CustomerBillingAddress : CustomerAddress
{
    public override string Type => "Billing";

    public CustomerBillingAddress(Address address) : base(address) { }
    private CustomerBillingAddress() : base() { }
}
