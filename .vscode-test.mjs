import { defineConfig } from "@vscode/test-cli";

export default defineConfig([
  {
    label: "Valid Single Folder Workspace",
    files: "out/test/integ/validWorkspace/**/*.test.js",
    workspaceFolder: "./sampleWorkspaces/singleFolderWorkspace",
  },
]);
