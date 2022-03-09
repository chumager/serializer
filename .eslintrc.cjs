module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended"],
  rules: {
    "no-console": 0,
    "max-len": [
      "error",
      {
        code: 120,
        ignoreComments: true
      }
    ],
    "prettier/prettier": [
      "warn",
      {
        printWidth: 120,
        tabWidth: 2,
        bracketSpacing: false,
        trailingComma: "none",
        arrowParens: "avoid"
      }
    ]
  },
  // parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      es6: true
    },
    sourceType: "module"
  }
};
