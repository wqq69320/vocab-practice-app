const js = require("@eslint/js");
const globals = require("globals");
module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: {
      // 스타일성 규칙은 배포를 막지 않도록 OFF
      indent: "off",
      "max-len": "off",
      "operator-linebreak": "off",
      "comma-dangle": "off",
      "object-curly-spacing": "off",
      "keyword-spacing": "off",
      "space-before-blocks": "off",
      "space-before-function-paren": "off",
      "key-spacing": "off",
      "comma-spacing": "off",
      "brace-style": "off",
      "eol-last": "off",
      "no-trailing-spaces": "off",
      "no-mixed-spaces-and-tabs": "off",
      // 경고로만 남김(배포 안 막음)
      "no-unused-vars": ["warn", { args: "after-used", argsIgnorePattern: "^_" }],
    },
  },
];
