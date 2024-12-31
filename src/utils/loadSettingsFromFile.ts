import { ConfigurationTarget, type Uri, workspace } from "vscode";

export async function loadSettingsFromFile(fileUri: Uri) {
  let recommendedSettingsJson: Record<string, any>;

  const document = await workspace.openTextDocument(fileUri);

  try {
    recommendedSettingsJson = JSON.parse(document.getText());
  } catch (error) {
    throw new Error("Invalid JSON format in the settings file.");
  }

  await Promise.allSettled(
    Object.entries(recommendedSettingsJson).map(([key, value]) =>
      workspace
        .getConfiguration()
        .update(key, value, ConfigurationTarget.Global)
    )
  );
}
