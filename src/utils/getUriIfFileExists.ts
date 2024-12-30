import path from "path";
import { type WorkspaceFolder, Uri, workspace } from "vscode";
import { FILE_NAME } from "../constants";

export async function getUriIfFileExists(
  workspaceFolder: WorkspaceFolder
): Promise<Uri | undefined> {
  const folderPath = workspaceFolder.uri.fsPath;

  const filePath = path.join(path.join(folderPath, ".vscode"), FILE_NAME);
  const fileUri = Uri.file(filePath);

  try {
    await workspace.fs.stat(fileUri);

    return fileUri;
  } catch (error) {
    return undefined;
  }
}
