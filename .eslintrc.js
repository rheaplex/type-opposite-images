module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "curly": "error",
    "quotes": ["error",
               "double",
               { "avoidEscape": true,
                 "allowTemplateLiterals": true }],
    "semi": ["error", "always", ]
  },
  "globals": {
    "artifacts": "readonly",
    "assert": "readonly",
    "contract": "readonly",
    "ethers": "readonly",
    "it": "readonly",
    "module": "writable"
  }
};
