const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'kumo.js',
    path: path.resolve(__dirname, 'dist/js'),
    library: 'Kumo',
  },
};