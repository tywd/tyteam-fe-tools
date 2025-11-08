import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.base.config';

const prodConfig: Configuration = merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
});

export default prodConfig;