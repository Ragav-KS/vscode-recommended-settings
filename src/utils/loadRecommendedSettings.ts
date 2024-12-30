import { ConfigurationTarget, window, workspace } from "vscode";
import { getUriIfFileExists } from "./getUriIfFileExists";

export async function loadRecommendedSettings() {
  if (!workspace.workspaceFolders) {
    window.showErrorMessage("Cannot be run outside of a workspace.");
    return;
  }

  if (workspace.workspaceFolders?.length === 0) {
    window.showErrorMessage("No folders found in workspace");
    return;
  }

  if (workspace.workspaceFolders?.length > 1) {
    window.showErrorMessage(
      "Loading from multi-folder workspace is currently not supported."
    );
    return;
  }

  const workspaceFolder = workspace.workspaceFolders[0];

  const fileUri = await getUriIfFileExists(workspaceFolder);

  if (!fileUri) {
    window.showErrorMessage(
      "Recommended settings file not found in workspace."
    );

    return;
  }

  console.log("Found `recommended-settings.json`. Loading settings");

  const recommendedSettingsJson = await workspace
    .openTextDocument(fileUri)
    .then((document) => JSON.parse(document.getText()) as Record<string, any>);

  await Promise.allSettled(
    Object.entries(recommendedSettingsJson).map(([key, value]) =>
      workspace
        .getConfiguration()
        .update(key, value, ConfigurationTarget.Global)
    )
  );

  window.showInformationMessage(
    "Loaded project recommended settings to Global settings."
  );
}
