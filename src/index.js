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
          const { environmentVariable } = opts;
          const env = environmentVariable
            ? process.env[environmentVariable]
            : process.env.BABEL_ENV;
          const directory = opts.directory || process.cwd();
          const fileFormat = opts.fileFormat || '.env';

          const fullPath = `${directory}/${fileFormat}${env && `.${env}`}`;

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
