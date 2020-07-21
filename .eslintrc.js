module.exports = {
  "env" : {
    "browser" : true,
    "es6" : true
  },
  "plugins" : ["@typescript-eslint"],
  "extends" : ["@nuxtjs", "eslint:recommended"],
  "globals" : {
    "Atomics" : "readonly",
    "SharedArrayBuffer" : "readonly"
  },
  "parserOptions" : {
    "parser" : "@typescript-eslint/parser",
    "ecmaVersion" : 2018,
    "sourceType" : "module"
  },
  "rules" : {
    "@typescript-eslint/no-unused-vars" : "error"
  },
};
