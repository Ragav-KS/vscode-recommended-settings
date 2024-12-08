import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Activating extension");

  const disposable = vscode.commands.registerCommand(
    "recommended-settings.helloWorld",
    () => {
      vscode.window.showInformationMessage(
        "Hello World from Recommended Settings!"
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
