import { commands, type ExtensionContext } from "vscode";
import { loadRecommendedSettings } from "./utils/loadRecommendedSettings";
import { showNotificationIfFileExists } from "./utils/showNotificationIfFileExists";

export function activate(context: ExtensionContext) {
  console.log("Activating extension");

  showNotificationIfFileExists();

  const disposable = commands.registerCommand(
    "recommended-settings.load-recommended-settings",
    loadRecommendedSettings
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
