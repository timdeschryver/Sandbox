using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sandbox.ApiService;

public class PersonMapping : IEntityTypeConfiguration<Person>
{
    public void Configure(EntityTypeBuilder<Person> builder)
    {
        builder.ToTable("Persons", schema: "apiservice");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FirstName).IsRequired().HasMaxLength(255);
        builder.Property(x => x.LastName).IsRequired().HasMaxLength(255);
        builder.Property(x => x.Email).IsRequired().HasMaxLength(255);
        builder.Property(x => x.DateOfBirth).IsRequired();
    }
}
