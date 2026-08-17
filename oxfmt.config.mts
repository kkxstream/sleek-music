import { defineConfig } from "oxfmt";

export default defineConfig({
  sortImports: {
    groups: [
      ["builtin", "external"],
      ["internal", "subpath"],
      ["parent", "sibling", "index"],
      "unknown",
    ],
    ignoreCase: false,
  },
  ignorePatterns: [".agents/**", ".expo/**", "tamagui-web.css", "tamagui.generated.css"],
});
