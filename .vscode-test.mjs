import { defineConfig } from "@vscode/test-cli";

export default defineConfig([
  {
    label: "Valid Single Folder Workspace",
    files: "out/test/integ/validWorkspace/**/*.test.js",
    workspaceFolder: "./sampleWorkspaces/singleFolderWorkspace",
  }, 
  {
    label: "Invalid Workspace",
    files: "out/test/integ/invalidWorkspace/**/*.test.js",
    workspaceFolder: "./sampleWorkspaces/invalidWorkspace",
  },
]);
