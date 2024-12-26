import { ok } from "assert";
import Sinon, { type SinonSpy } from "sinon";
import { commands, window } from "vscode";

suite(
  "'Load Project Recommended Settings' command functions as expected",
  () => {
    let errorMessageSpy: SinonSpy;

    suiteSetup(() => {
      errorMessageSpy = Sinon.spy(window, "showErrorMessage");
    });

    suiteTeardown(() => {
      Sinon.reset();
      Sinon.restore();
    });

    test("command should not be registered automatically", async () => {
      const registeredCommands = await commands.getCommands();

      ok(
        !registeredCommands.includes(
          "recommended-settings.load-recommended-settings"
        )
      );
    });

    test("Command should fail if recommended settings file is not found", async () => {
      // trigger
      await commands.executeCommand(
        "recommended-settings.load-recommended-settings"
      );

      // assert
      ok(
        errorMessageSpy.calledOnceWith(
          "Recommended settings file not found in workspace."
        )
      );
    });
  }
);
