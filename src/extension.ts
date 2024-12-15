import path from "path";
import {
  commands,
  ConfigurationTarget,
  Uri,
  window,
  workspace,
  type ExtensionContext,
} from "vscode";

export function activate(context: ExtensionContext) {
  console.log("Activating extension");

  const disposable = commands.registerCommand(
    "recommended-settings.load-recommended-settings",
    async () => {
      const filename: string | undefined = workspace
        .getConfiguration("recommended-settings")
        .get("recommended-settings.recommended-settings-file");

      if (!filename) {
        window.showErrorMessage(
          "`recommended-settings.recommended-settings-file` setting is misconfigured."
        );
        return;
      }

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

      const folderPath = workspaceFolder.uri.fsPath;

      const filePath = path.join(path.join(folderPath, ".vscode"), filename);
      const fileUri = Uri.file(filePath);

      try {
        await workspace.fs.stat(fileUri);
      } catch (err) {
        window.showErrorMessage(
          "Recommended settings file not found in workspace."
        );
        return;
      }

      console.log("Found `recommended-settings.json`. Loading settings");

      const recommendedSettingsJson = await workspace
        .openTextDocument(fileUri)
        .then(
          (document) => JSON.parse(document.getText()) as Record<string, any>
        );

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
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
