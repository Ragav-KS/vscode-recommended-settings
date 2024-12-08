import { window, commands, type ExtensionContext } from "vscode";

export function activate(context: ExtensionContext) {
  console.log("Activating extension");

  const disposable = commands.registerCommand(
    "recommended-settings.load-recommended-settings",
    () => {
      window.showInformationMessage("Hello World from Recommended Settings!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
