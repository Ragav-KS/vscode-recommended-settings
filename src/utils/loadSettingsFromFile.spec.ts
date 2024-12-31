import { fail, ok, strictEqual } from "assert";
import { SinonSandbox, createSandbox, match } from "sinon";
import {
  ConfigurationTarget,
  TextDocument,
  Uri,
  workspace,
  type WorkspaceConfiguration,
} from "vscode";
import { loadSettingsFromFile } from "./loadSettingsFromFile";

suite("loadSettingsFromFile Tests", () => {
  const fileUri = Uri.file("/path/to/settings.json");
  let sandbox: SinonSandbox;

  setup(() => {
    sandbox = createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test("Should load settings from file and update configuration", async () => {
    const settingsContent = JSON.stringify({
      "editor.fontSize": 14,
      "editor.tabSize": 4,
    });

    const openTextDocumentStub = sandbox
      .stub(workspace, "openTextDocument")
      .resolves({
        getText: () => settingsContent,
      } as TextDocument);

    const updateStub = sandbox.fake.resolves(undefined);

    sandbox.stub(workspace, "getConfiguration").returns({
      update: updateStub,
    } as unknown as WorkspaceConfiguration);

    await loadSettingsFromFile(fileUri);

    ok(openTextDocumentStub.calledOnceWith(match(fileUri)));
    ok(updateStub.calledTwice);
    ok(
      updateStub.calledWith("editor.fontSize", 14, ConfigurationTarget.Global)
    );
    ok(updateStub.calledWith("editor.tabSize", 4, ConfigurationTarget.Global));
  });

  test("Should handle empty settings file gracefully", async () => {
    const settingsContent = "{}";

    const openTextDocumentStub = sandbox
      .stub(workspace, "openTextDocument")
      .resolves({
        getText: () => settingsContent,
      } as TextDocument);

    const updateStub = sandbox.fake.resolves(undefined);

    sandbox.stub(workspace, "getConfiguration").returns({
      update: updateStub,
    } as unknown as WorkspaceConfiguration);

    await loadSettingsFromFile(fileUri);

    ok(openTextDocumentStub.calledOnceWith(match(fileUri)));
    ok(updateStub.notCalled);
  });

  test("Should handle invalid JSON in settings file", async () => {
    const settingsContent = "{ invalid json }";

    const openTextDocumentStub = sandbox
      .stub(workspace, "openTextDocument")
      .resolves({
        getText: () => settingsContent,
      } as TextDocument);

    try {
      await loadSettingsFromFile(fileUri);

      fail("Expected error to be thrown");
    } catch (error) {
      if (error instanceof Error) {
        ok(openTextDocumentStub.calledOnceWith(match(fileUri)));

        strictEqual(error.message, "Invalid JSON format in the settings file.");
      } else {
        fail("Expected error to be instance of Error");
      }
    }
  });
});
