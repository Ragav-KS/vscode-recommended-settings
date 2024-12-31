import * as assert from "assert";
import sinon from "sinon";
import { FileSystemError, FileType, Uri, workspace } from "vscode";
import { FILE_NAME } from "../constants";
import { getUriIfFileExists } from "./getUriIfFileExists";

suite("getUriIfFileExists is as expected", () => {
  let workspaceFolder: any;
  let sandbox: sinon.SinonSandbox;

  setup(() => {
    workspaceFolder = {
      uri: Uri.file("/path/to/workspace"),
    };

    sandbox = sinon.createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test("should return the file URI if the file exists", async () => {
    const statStub = sandbox.stub().resolves({
      ctime: 0,
      mtime: 0,
      size: 0,
      type: FileType.File,
    });

    sandbox.stub(workspace, "fs").value({
      stat: statStub,
    });

    const result = await getUriIfFileExists(workspaceFolder);

    assert.strictEqual(result?.path, `/path/to/workspace/.vscode/${FILE_NAME}`);
    assert.strictEqual(statStub.calledOnce, true);
  });

  test("should return undefined if the file does not exist", async () => {
    const statStub = sandbox
      .stub()
      .throws(
        new FileSystemError(
          "Error: ENOENT: no such file or directory, stat 'g:\\Projects\\some-project\\.vscode\\recommended-settings.json'"
        )
      );

    sandbox.stub(workspace, "fs").value({
      stat: statStub,
    });

    const result = await getUriIfFileExists(workspaceFolder);

    assert.strictEqual(result, undefined);
    assert.strictEqual(statStub.calledOnce, true);
  });
});
