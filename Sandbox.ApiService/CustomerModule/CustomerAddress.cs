namespace Sandbox.ApiService.CustomerModule;

public abstract class CustomerAddress
{
    public int Id { get; private set; }
    public abstract string Type { get; }

    public Address Address { get; private set; }

    protected CustomerAddress(Address address)
    {
        Address = address;
    }

    protected CustomerAddress() { }
}
