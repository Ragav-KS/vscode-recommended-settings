import { equal, ok } from "assert";
import Sinon, { type SinonSpy } from "sinon";
import { commands, ConfigurationTarget, window, workspace } from "vscode";

suite(
  "'Load Project Recommended Settings' command functions as expected",
  () => {
    let informationMessageSpy: SinonSpy;

    suiteSetup(() => {
      informationMessageSpy = Sinon.spy(window, "showInformationMessage");
    });

    test("command should be registered", async () => {
      const registeredCommands = await commands.getCommands();

      ok(
        registeredCommands.includes(
          "recommended-settings.load-recommended-settings"
        )
      );
    });

    test("Command should load settings from recommended settings file", async () => {
      // setup
      workspace
        .getConfiguration()
        .update("git.confirmForcePush", true, ConfigurationTarget.Global);

      // trigger
      await commands.executeCommand(
        "recommended-settings.load-recommended-settings"
      );

      // assert
      equal(
        await workspace.getConfiguration().get("git.confirmForcePush"),
        false
      );

      ok(
        informationMessageSpy.calledOnceWith(
          "Loaded project recommended settings to Global settings."
        )
      );
    });
  }
);
