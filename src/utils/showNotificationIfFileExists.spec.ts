import { ok } from "assert";
import { createSandbox, SinonSandbox, SinonStub } from "sinon";
import { Memento, Uri, window, workspace } from "vscode";
import * as getUriIfFileExists from "./getUriIfFileExists";
import * as loadSettingsFromFile from "./loadSettingsFromFile";
import { showNotificationIfFileExists } from "./showNotificationIfFileExists";

suite("showNotificationIfFileExists is as expected", () => {
  let sandbox: SinonSandbox;
  let mementoStub: SinonStub;
  let getUriIfFileExistsStub: SinonStub;
  let showInformationMessageStub: SinonStub;
  let loadSettingsFromFileStub: SinonStub;

  setup(() => {
    sandbox = createSandbox();
    mementoStub = sandbox.mock();
    getUriIfFileExistsStub = sandbox.stub(
      getUriIfFileExists,
      "getUriIfFileExists"
    );
    showInformationMessageStub = sandbox.stub(window, "showInformationMessage");
    loadSettingsFromFileStub = sandbox.stub(
      loadSettingsFromFile,
      "loadSettingsFromFile"
    );
  });

  teardown(() => {
    sandbox.restore();
  });

  test("Should not proceed if no workspace folders", async () => {
    sandbox.stub(workspace, "workspaceFolders").value(undefined);

    await showNotificationIfFileExists(mementoStub as unknown as Memento);

    ok(getUriIfFileExistsStub.notCalled);
    ok(showInformationMessageStub.notCalled);
    ok(loadSettingsFromFileStub.notCalled);
  });

  test("Should not proceed if multiple workspace folders", async () => {
    sandbox.stub(workspace, "workspaceFolders").value([{}, {}]);

    await showNotificationIfFileExists(mementoStub as unknown as Memento);

    ok(getUriIfFileExistsStub.notCalled);
    ok(showInformationMessageStub.notCalled);
    ok(loadSettingsFromFileStub.notCalled);
  });

  test("Should not proceed if already notified", async () => {
    sandbox.stub(workspace, "workspaceFolders").value([{}]);
    const mementoGetStub = sandbox.stub().returns(true);
    const mementoStub = { get: mementoGetStub } as unknown as Memento;

    await showNotificationIfFileExists(mementoStub);

    ok(mementoGetStub.calledOnceWith("recommended-settings-notified"));
    ok(getUriIfFileExistsStub.notCalled);
    ok(showInformationMessageStub.notCalled);
    ok(loadSettingsFromFileStub.notCalled);
  });

  test("Should not proceed if file does not exist", async () => {
    sandbox.stub(workspace, "workspaceFolders").value([{}]);
    const mementoGetStub = sandbox.stub().returns(false);
    const mementoStub = { get: mementoGetStub } as unknown as Memento;
    getUriIfFileExistsStub.resolves(undefined);

    await showNotificationIfFileExists(mementoStub);

    ok(mementoGetStub.calledOnceWith("recommended-settings-notified"));
    ok(getUriIfFileExistsStub.calledOnce);
    ok(showInformationMessageStub.notCalled);
    ok(loadSettingsFromFileStub.notCalled);
  });

  test("Should load settings if user selects Yes", async () => {
    const fileUri = Uri.file("/path/to/settings.json");
    sandbox.stub(workspace, "workspaceFolders").value([{}]);
    const mementoGetStub = sandbox.stub().returns(false);
    const mementoUpdateStub = sandbox.stub();
    const mementoStub = {
      get: mementoGetStub,
      update: mementoUpdateStub,
    } as unknown as Memento;
    getUriIfFileExistsStub.resolves(fileUri);
    showInformationMessageStub.resolves("Yes");

    await showNotificationIfFileExists(mementoStub);

    ok(mementoGetStub.calledOnceWith("recommended-settings-notified"));
    ok(getUriIfFileExistsStub.calledOnce);
    ok(showInformationMessageStub.calledTwice);
    ok(
      showInformationMessageStub.firstCall.calledWith(
        "Workspace has recommended some settings. Do you want to load them?",
        "Yes",
        "No"
      )
    );
    ok(
      showInformationMessageStub.secondCall.calledWith(
        "Loaded project recommended settings to Global settings."
      )
    );
    ok(loadSettingsFromFileStub.calledOnceWith(fileUri));
    ok(mementoUpdateStub.calledOnceWith("recommended-settings-notified", true));
  });

  test("Should not load settings if user selects No", async () => {
    const fileUri = Uri.file("/path/to/settings.json");
    sandbox.stub(workspace, "workspaceFolders").value([{}]);
    const mementoGetStub = sandbox.stub().returns(false);
    const mementoUpdateStub = sandbox.stub();
    const mementoStub = {
      get: mementoGetStub,
      update: mementoUpdateStub,
    } as unknown as Memento;
    getUriIfFileExistsStub.resolves(fileUri);
    showInformationMessageStub.resolves("No");

    await showNotificationIfFileExists(mementoStub);

    ok(getUriIfFileExistsStub.calledOnce);
    ok(showInformationMessageStub.calledOnce);
    ok(loadSettingsFromFileStub.notCalled);
    ok(mementoUpdateStub.calledOnceWith("recommended-settings-notified", true));
  });

  test("Should not load settings if user dismisses the message", async () => {
    const fileUri = Uri.file("/path/to/settings.json");
    sandbox.stub(workspace, "workspaceFolders").value([{}]);
    const mementoGetStub = sandbox.stub().returns(false);
    const mementoUpdateStub = sandbox.stub();
    const mementoStub = {
      get: mementoGetStub,
      update: mementoUpdateStub,
    } as unknown as Memento;
    getUriIfFileExistsStub.resolves(fileUri);
    showInformationMessageStub.resolves(undefined);

    await showNotificationIfFileExists(mementoStub);

    ok(getUriIfFileExistsStub.calledOnce);
    ok(showInformationMessageStub.calledOnce);
    ok(loadSettingsFromFileStub.notCalled);
    ok(mementoUpdateStub.notCalled);
  });
});
