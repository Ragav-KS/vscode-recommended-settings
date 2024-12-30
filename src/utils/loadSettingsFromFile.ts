import { ConfigurationTarget, type Uri, workspace } from "vscode";

export async function loadSettingsFromFile(fileUri: Uri) {
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
}
