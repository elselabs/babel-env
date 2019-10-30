const process = require('process');
const dotenv = require('dotenv');

module.exports = babel => {
  const { types } = babel;
  return {
    visitor: {
      ImportDeclaration: (path, state) => {
        const { opts } = state;
        const moduleName = opts.moduleName || 'babel-env';
        if (path.node.source.value === moduleName) {
          // get environment variable from options or default to BABEL_ENV
          const { environmentVariable } = opts;
          const environment = environmentVariable
            ? process.env[environmentVariable]
            : process.env.BABEL_ENV;

          // get directory from options or default to current working directory
          const directory = opts.directory || process.cwd();

          // get file format or default to .env
          let fileName = opts.fileFormat || '.env';
          // if there is an environment then append the file name
          if (environment) {
            fileName = fileName.concat(`.${environment}`);
          }

          const fullPath = `${directory}/${fileName}`;

          const envFile = dotenv.config({
            path: fullPath
          });

          path.node.specifiers.forEach((specifier, i) => {
            if (specifier.type === 'ImportDefaultSpecifier') {
              const { name } = specifier.local;
              const bindings = path.scope.getBinding(name);
              bindings.referencePaths.forEach(ref => {
                ref.replaceWith(types.valueToNode(envFile.parsed));
              });
            } else {
              const { name } = specifier.imported;
              const bindings = path.scope.getBinding(name);
              bindings.referencePaths.forEach(ref => {
                ref.replaceWith(types.valueToNode(envFile.parsed[name]));
              });
            }
          });
          path.remove();
        }
      }
    }
  };
};
