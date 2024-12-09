import { ok } from "assert";
import { assert } from "console";

import { commands, extensions, window } from "vscode";

suite("Extension Test Suite", () => {
  window.showInformationMessage("Start all tests.");

  suiteTeardown(() => {
    window.showInformationMessage("All tests done!");
  });

  test("Extension should activate", async () => {
    const extension = extensions.getExtension("ragavks.recommended-settings");

    ok(extension, "Extension found");

    await extension.activate();

    ok(extension.isActive, "Extension should be able to activate");
  });

  test("'Load Workspace Recommended Settings' should be registered", async () => {
    const registeredCommands = await commands.getCommands();

    assert(registeredCommands.includes("Load Workspace Recommended Settings"));
  });
});
