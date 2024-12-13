import { equal, ok } from "assert";
import { fake, reset, spy, stub, type SinonSpy } from "sinon";
import {
  commands,
  extensions,
  FileSystemError,
  FileType,
  window,
  workspace,
  type TextDocument,
} from "vscode";

suite("Extension Test Suite", () => {
  let informationMessageSpy: SinonSpy;
  let errorMessageSpy: SinonSpy;

  suiteSetup(() => {
    informationMessageSpy = spy(window, "showInformationMessage");
    errorMessageSpy = spy(window, "showErrorMessage");
  });

  suite("Activation", () => {
    test("Extension should activate", async () => {
      const extension = extensions.getExtension("ragavks.recommended-settings");

      ok(extension, "Extension found");

      await extension.activate();

      ok(extension.isActive, "Extension should be able to activate");
    });
  });

  suite("'Load Workspace Recommended Settings' command", () => {
    suiteSetup(async () => {
      const extension = extensions.getExtension(
        "ragavks.recommended-settings"
      )!;

      await extension.activate();
    });

    teardown(() => {
      reset();
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
      // setup stubs
      stub(workspace, "workspaceFolders").value([
        {
          uri: {
            fsPath: "g:\\Projects\\some-project",
          },
        },
      ]);

      stub(workspace, "fs").value({
        stat: stub().resolves({
          ctime: 0,
          mtime: 0,
          size: 0,
          type: FileType.File,
        }),
      });

      stub(workspace, "openTextDocument").resolves({
        getText: fake.returns('{"files.autoSave": true}'),
      } as unknown as TextDocument);

      // trigger
      await commands.executeCommand(
        "recommended-settings.load-recommended-settings"
      );

      // assert
      equal(await workspace.getConfiguration().get("files.autoSave"), true);
      ok(
        informationMessageSpy.calledOnceWith(
          "Loaded workspace recommended settings to Global settings."
        )
      );
    });

    test("Command should fail if recommended settings file is not found", async () => {
      stub(workspace, "workspaceFolders").value([
        {
          uri: {
            fsPath: "g:\\Projects\\some-project",
          },
        },
      ]);

      stub(workspace, "fs").value({
        stat: stub().throws(
          new FileSystemError(
            "Error: ENOENT: no such file or directory, stat 'g:\\Projects\\some-project\\.vscode\\recommended-settings.json'"
          )
        ),
      });

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
  });
});
