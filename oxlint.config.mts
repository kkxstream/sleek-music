import { defineConfig } from "oxlint";
import native from "oxlint-config-universe/native";

export default defineConfig({
  extends: [native],
  ignorePatterns: [".agents/**", ".expo/**", "tamagui-web.css", "tamagui.generated.css"],
});
