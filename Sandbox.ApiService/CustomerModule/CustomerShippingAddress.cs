namespace Sandbox.ApiService.CustomerModule;

public class CustomerShippingAddress : CustomerAddress
{
    public override string Type => "Shipping";
    public CustomerShippingAddress(Address address, string? note) : base(address)
    {
        Note = note;
    }

    public string? Note { get; private set; }

#pragma warning disable CS8618 
    private CustomerShippingAddress() { }
#pragma warning restore CS8618 
}
