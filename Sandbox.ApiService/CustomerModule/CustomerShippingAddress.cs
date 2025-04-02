namespace Sandbox.ApiService.CustomerModule;

public class CustomerShippingAddress : CustomerAddress
{
    public override string Type => "Shipping";
    public string Note { get; private set; } = default!;

    public CustomerShippingAddress(Address address, string note) : base(address)
    {
        Note = note;
    }

    private CustomerShippingAddress() : base() { }
}
