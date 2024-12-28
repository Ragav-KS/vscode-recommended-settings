import { ok } from "assert";
import Sinon, { type SinonSpy } from "sinon";
import {
  type TextDocument,
  type WorkspaceConfiguration,
  ConfigurationTarget,
  FileSystemError,
  FileType,
  window,
  workspace,
} from "vscode";
import { loadRecommendedSettings } from "./loadRecommendedSettings";

suite("LoadRecommendedSettings is as expected", () => {
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

  teardown(() => {
    Sinon.reset();
  });

  test("Command should fail if executed outside of a workspace", async () => {
    // setup Sinon.stubs
    Sinon.stub(workspace, "workspaceFolders").value(undefined);

    // trigger
    await loadRecommendedSettings();

    // assert
    ok(errorMessageSpy.calledOnceWith("Cannot be run outside of a workspace."));
  });

  test("Command should fail if workspace doesn't contain any folders for some reason", async () => {
    // setup Sinon.stubs
    Sinon.stub(workspace, "workspaceFolders").value([]);

    // trigger
    await loadRecommendedSettings();

    // assert
    ok(errorMessageSpy.calledOnceWith("No folders found in workspace"));
  });

  test("Command should fail if run inside a multi folder workspace", async () => {
    // setup Sinon.stubs
    Sinon.stub(workspace, "workspaceFolders").value([{}, {}]);

    // trigger
    await loadRecommendedSettings();

    // assert
    ok(
      errorMessageSpy.calledOnceWith(
        "Loading from multi-folder workspace is currently not supported."
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
    await loadRecommendedSettings();

    // assert
    ok(
      errorMessageSpy.calledOnceWith(
        "Recommended settings file not found in workspace."
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

    const updateConfigurationFake = Sinon.fake.resolves(undefined);

    Sinon.stub(workspace, "getConfiguration").returns({
      update: updateConfigurationFake,
    } as unknown as WorkspaceConfiguration);

    // trigger
    await loadRecommendedSettings();

    // assert
    ok(
      updateConfigurationFake.calledOnceWith(
        "files.autoSave",
        true,
        ConfigurationTarget.Global
      )
    );

    ok(
      informationMessageSpy.calledOnceWith(
        "Loaded project recommended settings to Global settings."
      )
    );
  });
});
