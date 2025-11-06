## 使用

安装：

```bash
pnpm add @tyteam/prettier-config prettier -D
```

在项目根目录创建 `prettier.config.js`：

```js
import tyPrettier from '@tyteam/prettier-config';
export default { ...tyPrettier };
```

验证：

```bash
npx prettier --check .
```


