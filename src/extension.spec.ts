import { equal, ok } from "assert";
import Sinon, { type SinonSpy } from "sinon";
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
    informationMessageSpy = Sinon.spy(window, "showInformationMessage");
    errorMessageSpy = Sinon.spy(window, "showErrorMessage");
  });

  suiteTeardown(() => {
    Sinon.reset();
    Sinon.restore();
  });

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

    teardown(() => {
      Sinon.reset();
    });

    test("command should be registered", async () => {
      const registeredCommands = await commands.getCommands();

      ok(
        registeredCommands.includes(
          "recommended-settings.load-recommended-settings"
        )
      );
    });

    test("Command should fail if executed outside of a workspace", async () => {
      // setup Sinon.stubs
      Sinon.stub(workspace, "workspaceFolders").value(undefined);

      // trigger
      await commands.executeCommand(
        "recommended-settings.load-recommended-settings"
      );

      // assert
      ok(
        errorMessageSpy.calledOnceWith("Cannot be run outside of a workspace.")
      );
    });

    test("Command should fail if workspace doesn't contain any folders for some reason", async () => {
      // setup Sinon.stubs
      Sinon.stub(workspace, "workspaceFolders").value([]);

      // trigger
      await commands.executeCommand(
        "recommended-settings.load-recommended-settings"
      );

      // assert
      ok(errorMessageSpy.calledOnceWith("No folders found in workspace"));
    });

    test("Command should fail if run inside a multi folder workspace", async () => {
      // setup Sinon.stubs
      Sinon.stub(workspace, "workspaceFolders").value([{}, {}]);

      // trigger
      await commands.executeCommand(
        "recommended-settings.load-recommended-settings"
      );

      // assert
      ok(
        errorMessageSpy.calledOnceWith(
          "Loading from multi-folder workspace is currently not supported."
        )
      );
    });

    test("Command should load settings from recommended settings file", async () => {
      // setup Sinon.stubs
      Sinon.stub(workspace, "workspaceFolders").value([
        {
          uri: {
            fsPath: "g:\\Projects\\some-project",
          },
        },
      ]);

      Sinon.stub(workspace, "fs").value({
        stat: Sinon.stub().resolves({
          ctime: 0,
          mtime: 0,
          size: 0,
          type: FileType.File,
        }),
      });

      Sinon.stub(workspace, "openTextDocument").resolves({
        getText: Sinon.fake.returns('{"files.autoSave": true}'),
      } as unknown as TextDocument);

      // trigger
      await commands.executeCommand(
        "recommended-settings.load-recommended-settings"
      );

      // assert
      equal(await workspace.getConfiguration().get("files.autoSave"), true);
      ok(
        informationMessageSpy.calledOnceWith(
          "Loaded project recommended settings to Global settings."
        )
      );
    });

    test("Command should fail if recommended settings file is not found", async () => {
      Sinon.stub(workspace, "workspaceFolders").value([
        {
          uri: {
            fsPath: "g:\\Projects\\some-project",
          },
        },
      ]);

      Sinon.stub(workspace, "fs").value({
        stat: Sinon.stub().throws(
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
