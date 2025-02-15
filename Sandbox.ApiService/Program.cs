using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Sandbox.ApiService;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.AddSqlServerDbContext<ApiDbContext>(connectionName: "database");

var app = builder.Build();

app.UseStatusCodePages();
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

string[] summaries = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

var peopleGroup = app.MapGroup("people");
peopleGroup.MapGet("", async Task<Results<Ok<Person[]>, ProblemHttpResult>>(ApiDbContext db, CancellationToken cancellationToken) => {
    var persons = await db.Set<Person>().ToArrayAsync(cancellationToken);
    if (Random.Shared.Next(8) == 0)
    {
        return TypedResults.Problem(detail: "You got unlucky, please try again");
    }
    return TypedResults.Ok(persons);
});
peopleGroup.MapPost("", async (Person person, ApiDbContext db, CancellationToken cancellationToken) => {
    await db.Set<Person>().AddAsync(person, cancellationToken);
    await db.SaveChangesAsync(cancellationToken);
    return TypedResults.Created();
});
app.MapDefaultEndpoints();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
