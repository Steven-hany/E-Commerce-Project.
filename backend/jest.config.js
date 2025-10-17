export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": ["babel-jest", { configFile: "./babel.config.js" }]
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};
