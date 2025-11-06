## 使用

安装：

```bash
pnpm add @tyteam/stylelint-config stylelint -D
```

在项目根目录创建 `stylelint.config.js`：

```js
import tyteamConfig from '@tyteam/stylelint-config';
export default [...tyteamConfig];
```

验证：

```bash
npx stylelint "**/*.{css,scss,vue}"
```


