# Typography

用于定义字体相关的语义化样式。

文本排版将分为两类 classes：

1. 文本颜色 colors
2. 文本样式 styles

这两类 classes 两两组合即可得到几乎所有的文本样式。

```html
<p class="color-primary typography-body1">
    body text with text color primary
</p>

<p class="color-highlight typography-body2">
    body text variant 2 with color highlight
</p>
```

## 文本颜色

参见 [Colors 帮助文件](colors.md)。

## 文本样式

所有的样式 styles：

| class name | 说明         |
|------------|------------|
| headline1  | 最大标题       |
| headline2  | 页面主标题      |
| headline3  | 页面副标题      |
| headline4  | 内容标题       |
| body1      | 正文主体内容     |
| body2      | 正文主体内容，变体2 |
| button     | 文字按钮       |
| underline  | 下划线        |
| caption    | 注解文案       |

使用样式类的时候，请加上前缀 `typography-`:

```html
<div class="wrapper color-primary">
    <h1 class="typography-headline1">typography-headline1</h1>
    <h2 class="typography-headline2">typography-headline2</h2>
    <h3 class="typography-headline3">typography-headline3</h3>
    <h4 class="typography-headline4">typography-headline4</h4>
    <p class="typography-body1">typography-body1</p>
    <p class="typography-body2">typography-body2</p>
    <p class="typography-button">typography-button</p>
    <p class="typography-underline">typography-underline</p>
    <p class="typography-caption">typography-caption</p>
</div>
```

### 自定义

每一个样式类都 **只包含** 以下属性值：

- `font-weight: var(--font-weight-regular) or var(--font-weight-medium)`
- `font-size: var(--font-size-STYLE);`
- `line-height: var(--line-height-STYLE);`

> .typography-underline 还包含
> `text-decoration-line: underline;`
> 属性。

> 上文中的 `STYLE` 用于表示上面 styles 表格中的某一个 style

故可以直接修改对应的变量值即可，
例如修改 `typography-body1` 的文本大小为 18px，行高为 1.5：

```css
:root {
  --font-size-body1: 18px;
  --line-height-body1: 1.5;
}
```

当然直接修改 css 类样式也是可以的：

```css
.typography-body1 {
  font-size: 18px;
  line-height: 1.5;
}
```

### Other Variables

在 [shared/variables/typography.css](../src/shared/variables/typography.css) 文件中还包含如下变量：

```css
:root {
  /* font family */
  --font-family:  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  /* font weight values */
  --font-weight-medium: 500;
  --font-weight-regular: 400;
}
```

这些变量也可以进行自定义。
