const path = require('path');
const fs = require('fs');
const { generateTheme, getLessVars } = require('antd-theme-generator');
const _root = path.join(__dirname, '../');

// fs.readFile(
//   path.join(_root, '/node_modules/antd/lib/style/themes/index.less'),
//   'utf8',
//   function (err, files) {
//     var result = files.replace(/@\{root-entry-name\}/g, 'default');
//     fs.writeFile(
//       path.join(_root, '/node_modules/antd/lib/style/themes/index.less'),
//       result,
//       'utf8',
//       function (err) {
//         if (err) {
//           console.log(err);
//         }
//       },
//     );
//   },
// );

const themeVariables = getLessVars(path.join(_root, '/src/styles/vars.less'));
const defaultVars = getLessVars(
  path.join(_root, '/node_modules/antd/lib/style/themes/default.less'),
);
const darkVars = {
  ...getLessVars(
    path.join(_root, '/node_modules/antd/lib/style/themes/dark.less'),
  ),
  '@primary-color': defaultVars['@primary-color'],
  '@picker-basic-cell-active-with-range-color': 'darken(@primary-color, 20%)',
};
const lightVars = {
  ...getLessVars(
    path.join(_root, '/node_modules/antd/lib/style/themes/compact.less'),
  ),
  '@primary-color': defaultVars['@primary-color'],
};
fs.writeFileSync(
  path.join(_root, '/src/styles/dark.json'),
  JSON.stringify(darkVars),
);
fs.writeFileSync(
  path.join(_root, '/src/styles/light.json'),
  JSON.stringify(lightVars),
);
fs.writeFileSync(
  path.join(_root, '/src/styles/theme.json'),
  JSON.stringify(themeVariables),
);

const options = {
  stylesDir: path.join(_root, '/src'),
  antDir: path.join(_root, '/node_modules/antd'),
  varFile: path.join(_root, '/src/styles/vars.less'),
  themeVariables: Array.from(
    new Set([
      ...Object.keys(darkVars),
      ...Object.keys(lightVars),
      ...Object.keys(themeVariables),
    ]),
  ),
  outputFilePath: path.join(_root, '/public/color.less'),
};

generateTheme(options)
  .then((less) => {
    console.log('Theme generated successfully');
  })
  .catch((error) => {
    console.log('Error', error);
  });
