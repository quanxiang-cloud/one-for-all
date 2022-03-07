# Colors

用于定义颜色的语义化样式。

## 色彩范围

对于所有的颜色定义了一套 App 专有的色板，所有的颜色应从该色板中选取。

色板所有颜色：

- rose
- pink
- fuchsia
- purple
- violet
- indigo
- blue
- lightBlue
- cyan
- teal
- emerald
- green
- lime
- yellow
- amber
- orange
- red
- warmGray
- trueGray
- gray
- coolGray
- blueGray
- black

色板中每个颜色都会从浅到深进行分级（特殊颜色除外）：

```css
:root {
  --rose-50: #fff0f1;
  --rose-100: #ffe5e7;
  --rose-200: #fecdd3;
  --rose-300: #fda4af;
  --rose-400: #fb7185;
  --rose-500: #f43f5e;
  --rose-600: #e11d48;
  --rose-700: #be123c;
  --rose-800: #9f1239;
  --rose-900: #881337;
}
```

用户可修改该色板上的颜色变量值进行颜色修改。

### 语义化颜色

直接修改色板的颜色值太过于抽象和繁琐。故对于 App 中使用的颜色进行语义化处理。

重新定义一套语义化变量值，用户可以修改这些变量的值方便的进行颜色修改。

注意在开发过程中，所有涉及到颜色的部分需使用语义化变量或语义化变量的 class，
不可轻易使用诸如 `color: var(--gray-600);` 或 className: `text-gray-600` 
的形式。

对于缺少的语义化颜色变量，可以提 MR 进行添加。

#### 变量

所有的语义化颜色变量值如下：

| 变量名                         |           说明            | 默认值                 |
|-----------------------------|:-----------------------:|:--------------------|
| `--color-primary`           |          一级文本色          | `var(--gray-900)`   |
| `--color-secondary`         |          二级文本色          | `var(--gray-600)`   |
| `--color-secondary-lighter` | 二级文本色变体，灰色最淡，用于二级文本的背景色 | `var(--gray-100)`   |
| `--color-highlight`         |          高亮文本色          | `var(--blue-600)`   |
| `--color-highlight-lighter` | 高亮文本色变体，蓝色最淡，用于高亮文本的背景色 | `var(--blue-100)`   |
| `--color-placeholder`       |     placeholder 文本色     | `var(--gray-400)`   |
| `--color-bg-app`            |          应用背景色          | `#E6ECF9`           |
| `--color-light`             |        明亮主题下的白色         | `white`             |
| `--color-error`             |          错误文本色          | `var(--red-600)`    |
| `--color-error-light`       |      错误文本色变体，红色更淡       | `var(--red-400)`    |
| `--color-error-lighter`     | 错误文本色变体，红色最淡，用于错误文本的背景色 | `var(--red-50)`     |
| `--color-success`           |          成功文本色          | `var(--green-600)`  |
| `--color-success-light`     |      成功文本色变体，绿色更淡       | `var(--green-400)`  |
| `--color-success-lighter`   | 成功文本色变体，绿色最淡，用于成功文本的背景色 | `var(--green-50)`   |
| `--color-warning`           |          警告文本色          | `var(--yellow-600)` |
| `--color-success-lighter`   |      警告文本色变体，黄色更淡       | `var(--yellow-400)` |
| `--color-success-lighter`   | 警告文本色变体，黄色最淡，用于警告文本的背景色 | `var(--yellow-50)`  |

> 对于修改主题色的需求，应直接修改对应的颜色变量，尽量避免修改对应使用的 class

#### ClassName

一般而言，组件应自行定义语义化的 className，然后在对应的 className 中使用颜色变量：

```css
.qxp-btn__primary {
  color: var(--color-primary);
  background-color: var(--color-secondary-lighter);
}
```

但是对于那些想直接使用这些语义化变量而不想重新定义 className 的情况来说。
可以使用 `colors.css` 中自带的 className 以达到相同的效果。

具体参见 [shared/classes/colors.css](../src/shared/classes/colors.css)
