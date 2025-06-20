using System;
using Microsoft.Extensions.Time.Testing;

namespace Sandbox.Modules.Billing.Tests;

public class PlaceholderTest
{
    [Test]
    public async Task Placeholder_Test()
    {
        var fakeTime = new FakeTimeProvider(startDateTime: new DateTime(2025, 1, 1));
        fakeTime.Advance(TimeSpan.FromDays(1));
        await Assert.That(fakeTime.GetLocalNow()).IsEqualTo(new DateTime(2025, 1, 2));
    }
}
