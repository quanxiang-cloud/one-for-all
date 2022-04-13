# SCSS Puncture

Remove unwanted SCSS rules and declarations.

```typescript
import forming from '@one-for-all/scss-forming';

forming(someUglySCSS).then(({ scss, ast }) => {
  console.log('cleaned SCSS:\n', scss);
  return toSCSS(ast);
}).then((scssStr) => {
  // same nice cleaned scss
});

const { scss, ast } = forming(staledAST);
```
