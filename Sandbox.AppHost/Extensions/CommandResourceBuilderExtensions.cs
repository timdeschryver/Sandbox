using System.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Aspire.Hosting;

namespace Sandbox.AppHost.Extensions;

internal static class CommandResourceBuilderExtensions
{
    public static IResourceBuilder<NodeAppResource> WithPlaywrightRepeatCommand(this IResourceBuilder<NodeAppResource> builder, int repeatCount = 25)
    {
        var commandOptions = new CommandOptions
        {
            IconName = "ArrowRepeatAll",
            IsHighlighted = true,
        };

        builder.WithCommand(
            name: "repeat-playwright-tests",
            displayName: "Repeat Playwright Tests",
            executeCommand: async (context) =>
            {
#pragma warning disable ASPIREINTERACTION001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
                var interactionService = context.ServiceProvider.GetRequiredService<IInteractionService>();
                var prompt = await interactionService.PromptInputAsync("Repetition", "How many times do you want to repeat the Playwright tests?", new InteractionInput
                {
                    Label = "Repetition Count",
                    Description = "Enter the number of times to repeat the Playwright tests.",
                    InputType = InputType.Number,
                    Required = true,
                    Placeholder = "25",
                });
#pragma warning restore ASPIREINTERACTION001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

                return await OnRunCommand(builder, context, $"pnpm run test --repeat-each={prompt.Data?.Value}");
            },
            commandOptions: commandOptions);

        return builder;
    }

    private static async Task<ExecuteCommandResult> OnRunCommand(IResourceBuilder<NodeAppResource> builder, ExecuteCommandContext context, string command)
    {
        var loggerService = context.ServiceProvider.GetRequiredService<ResourceLoggerService>();
        var logger = loggerService.GetLogger(context.ResourceName);

        var processStartInfo = new ProcessStartInfo()
        {
            FileName = "cmd",
            RedirectStandardOutput = true,
            RedirectStandardInput = true,
            WorkingDirectory = builder.Resource.WorkingDirectory
        };

        var process = Process.Start(processStartInfo) ?? throw new InvalidOperationException("Failed to start process");
        await process.StandardInput.WriteLineAsync($"{command} & exit");

        while (!process.StandardOutput.EndOfStream)
        {
            string line = await process.StandardOutput.ReadLineAsync() ?? string.Empty;
            logger.LogInformation("{Line}", line);
        }

        return CommandResults.Success();
    }
}
