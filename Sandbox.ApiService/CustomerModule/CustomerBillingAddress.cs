namespace Sandbox.ApiService.CustomerModule;

public class CustomerBillingAddress : CustomerAddress
{
    public override string Type => "Billing";
    public CustomerBillingAddress(Address address) : base(address) { }

#pragma warning disable CS8618 
    private CustomerBillingAddress() { }
#pragma warning restore CS8618 
}
