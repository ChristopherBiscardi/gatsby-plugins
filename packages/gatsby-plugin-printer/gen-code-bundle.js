const React = require("react");
const ReactDOM = require("react-dom");
const rollup = require("rollup");
const commonjs = require("rollup-plugin-commonjs");
const resolve = require("rollup-plugin-node-resolve");
const replace = require("rollup-plugin-replace");
const builtins = require("rollup-plugin-node-builtins");
const globals = require("rollup-plugin-node-globals");
const babel = require("rollup-plugin-babel");
const fs = require("fs-extra");
const path = require("path");
const debug = require("debug")("gatsby-plugin-printer:gen-code-bundle");

const genCodeBundle = async ({
  componentPath = require.resolve("./default-user-component.js")
} = {}) => {
  debug("componentPath", componentPath);
  // check if component exists
  const fileExists = fs.existsSync(componentPath);
  if (componentPath && !fileExists) {
    const isAbsPath = path.isAbsolute(componentPath);
    const absWarning = isAbsPath
      ? `try using an absolute path to the component`
      : "";
    console.error(
      `gatsby-plugin-printer expected a file at \`${componentPath}\`, but none was found. ${absWarning}`
    );
  }
  // windows node fs expects a folder separator \ but imports in components need /
  const componentPathArray = componentPath.split(path.sep)
  // if we have node_modules in the path, find it and drop everything before it
  // and let normal resolution take over
  const nodeModIndex = componentPathArray.findIndex(text => text === 'node_modules')
  const relComponentPathArray = nodeModIndex > 0 ? componentPathArray.slice(nodeModIndex + 1) : componentPathArray
  const relComponentPath = relComponentPathArray.join('/')
  // bundle an instance of the application, using the user's component
  const bundle = await rollup.rollup({
    input: require.resolve("./app.js"),
    plugins: [
      resolve(),
      babel({
        presets: ["babel-preset-gatsby"],
        plugins: ["babel-plugin-preval"],
        runtimeHelpers: true
      }),
      commonjs({
        namedExports: {
          "react-dom": Object.keys(ReactDOM),
          react: Object.keys(React)
        }
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        __USER_COMPONENT_PATH__: relComponentPath
      }),
      builtins(),
      globals()
    ]
  });
  const { output } = await bundle.generate({ format: "iife" });
  // await fs.outputFile("./compiled-code.js", output[0].code);
  return output[0].code;
};

module.exports = genCodeBundle;
