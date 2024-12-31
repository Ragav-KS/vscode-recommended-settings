import { window, workspace } from "vscode";
import { getUriIfFileExists } from "./getUriIfFileExists";
import { loadSettingsFromFile } from "./loadSettingsFromFile";

export async function showNotificationIfFileExists() {
  if (!workspace.workspaceFolders || workspace.workspaceFolders.length !== 1) {
    return;
  }

  const workspaceFolder = workspace.workspaceFolders[0];

  const fileUri = await getUriIfFileExists(workspaceFolder);

  if (!fileUri) {
    return;
  }

  const selection = await window.showInformationMessage(
    "Workspace has recommended some settings. Do you want to load them?",
    "Yes",
    "No"
  );

  if (selection === "Yes") {
    await loadSettingsFromFile(fileUri);

    window.showInformationMessage(
      "Loaded project recommended settings to Global settings."
    );
  }
}
