import { ok } from "assert";
import { SinonSandbox, createSandbox } from "sinon";
import { Uri, window, workspace } from "vscode";
import * as getUriIfFileExistsModule from "./getUriIfFileExists";
import { loadRecommendedSettings } from "./loadRecommendedSettings";
import * as loadSettingsFromFileModule from "./loadSettingsFromFile";

suite("loadRecommendedSettings is as expected", () => {
  let sandbox: SinonSandbox;

  setup(() => {
    sandbox = createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test("Should show error message if not in a workspace", async () => {
    sandbox.stub(workspace, "workspaceFolders").value(undefined);
    const showErrorMessageStub = sandbox.stub(window, "showErrorMessage");

    await loadRecommendedSettings();

    ok(
      showErrorMessageStub.calledOnceWith(
        "Cannot be run outside of a workspace."
      )
    );
  });

  test("Should show error message if no folders found in workspace", async () => {
    sandbox.stub(workspace, "workspaceFolders").value([]);
    const showErrorMessageStub = sandbox.stub(window, "showErrorMessage");

    await loadRecommendedSettings();

    ok(showErrorMessageStub.calledOnceWith("No folders found in workspace"));
  });

  test("Should show error message if multiple folders found in workspace", async () => {
    sandbox.stub(workspace, "workspaceFolders").value([{}, {}]);
    const showErrorMessageStub = sandbox.stub(window, "showErrorMessage");

    await loadRecommendedSettings();

    ok(
      showErrorMessageStub.calledOnceWith(
        "Loading from multi-folder workspace is currently not supported."
      )
    );
  });

  test("Should show error message if recommended settings file not found", async () => {
    sandbox
      .stub(workspace, "workspaceFolders")
      .value([{ uri: Uri.file("/path/to/workspace") }]);
    sandbox
      .stub(getUriIfFileExistsModule, "getUriIfFileExists")
      .resolves(undefined);
    const showErrorMessageStub = sandbox.stub(window, "showErrorMessage");

    await loadRecommendedSettings();

    ok(
      showErrorMessageStub.calledOnceWith(
        "Recommended settings file not found in workspace."
      )
    );
  });

  test("Should load settings from file if recommended settings file is found", async () => {
    const workspaceFolder = { uri: Uri.file("/path/to/workspace") };
    const fileUri = Uri.file("/path/to/workspace/recommended-settings.json");

    sandbox.stub(workspace, "workspaceFolders").value([workspaceFolder]);
    sandbox
      .stub(getUriIfFileExistsModule, "getUriIfFileExists")
      .resolves(fileUri);
    const loadSettingsFromFileStub = sandbox
      .stub(loadSettingsFromFileModule, "loadSettingsFromFile")
      .resolves();
    const showInformationMessageStub = sandbox.stub(
      window,
      "showInformationMessage"
    );

    await loadRecommendedSettings();

    ok(loadSettingsFromFileStub.calledOnceWith(fileUri));
    ok(
      showInformationMessageStub.calledOnceWith(
        "Loaded project recommended settings to Global settings."
      )
    );
  });
});
