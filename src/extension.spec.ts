import { ok } from "assert";
import { commands, extensions } from "vscode";

suite("Extension Test Suite", () => {
  suite("Activation", () => {
    test("Extension should activate", async () => {
      const extension = extensions.getExtension("ragavks.recommended-settings");

      ok(extension, "Extension found");

      await extension.activate();

      ok(extension.isActive, "Extension should be able to activate");
    });
  });

  suite("'Load Project Recommended Settings' command", () => {
    suiteSetup(async () => {
      const extension = extensions.getExtension(
        "ragavks.recommended-settings"
      )!;

      await extension.activate();
    });

    test("command should be registered", async () => {
      const registeredCommands = await commands.getCommands();

      ok(
        registeredCommands.includes(
          "recommended-settings.load-recommended-settings"
        )
      );
    });
  });
});
