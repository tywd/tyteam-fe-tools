import type { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.base.config.ts';

const devConfig: Configuration & { devServer?: DevServerConfiguration } = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 8081, // 子应用端口（与主应用配置一致）
    open: true,
    historyApiFallback: true,
    hot: true,
    headers: {
      // 允许跨域（主应用加载必需）
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    }
  }
});

export default devConfig;