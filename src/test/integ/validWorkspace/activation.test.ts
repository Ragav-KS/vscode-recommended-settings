import { ok } from "assert";
import { extensions } from "vscode";

suite("Extension activation is as expected", () => {
  test("Extension should activate", async () => {
    const extension = extensions.getExtension("ragavks.recommended-settings");

    ok(extension, "Extension found");

    ok(extension.isActive, "Extension should be able to activate");
  });
});
