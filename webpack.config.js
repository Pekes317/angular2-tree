const path = require('path');

module.exports = {
  entry: [
    // Specify scss files
    './tree-lib/src/styles/main.scss'
  ],
  output: {
    filename: 'ngx-tree/style.css'
  },
  module: {
    // Add loader
    rules: [{
      test: /\.scss$/,
      loader: ['css-loader', 'sass-loader']
    }]
  }
};
