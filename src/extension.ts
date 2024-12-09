import path from "path";
import {
  commands,
  ConfigurationTarget,
  Uri,
  window,
  workspace,
  type ExtensionContext,
  type FileStat,
} from "vscode";

export function activate(context: ExtensionContext) {
  console.log("Activating extension");

  const disposable = commands.registerCommand(
    "recommended-settings.load-recommended-settings",
    () => {
      const filename = "recommended-settings.json";

      workspace.workspaceFolders?.forEach(async (workspaceFolder) => {
        const folderPath = workspaceFolder.uri.fsPath;

        const filePath = path.join(path.join(folderPath, ".vscode"), filename);
        const fileUri = Uri.file(filePath);

        let fileExists: FileStat | undefined = undefined;
        try {
          fileExists = await workspace.fs.stat(fileUri);
        } catch (err) {
          console.log("Recommended settings file not found.");
        }

        if (fileExists) {
          console.log("Found recommended-settings.json. Loading settings");

          const recommendedSettingsJson = await workspace
            .openTextDocument(fileUri)
            .then(
              (document) =>
                JSON.parse(document.getText()) as Record<string, any>
            );

          Object.entries(recommendedSettingsJson).forEach(([key, value]) => {
            workspace
              .getConfiguration()
              .update(key, value, ConfigurationTarget.Global);
          });

          window.showInformationMessage(
            "Loaded workspace recommended settings to Global settings."
          );
        } else {
          window.showErrorMessage(
            "Recommended settings file not found in workspace."
          );
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
