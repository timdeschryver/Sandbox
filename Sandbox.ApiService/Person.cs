using System;
using System.Diagnostics.CodeAnalysis;

namespace Sandbox.ApiService;

public class Person
{
    [SetsRequiredMembers]
    public Person(string firstName, string lastName, string email, DateTime dateOfBirth)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        DateOfBirth = dateOfBirth;
    }

    public long Id { get; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string Email { get; init; }
    public required DateTime DateOfBirth { get; init; }
}
