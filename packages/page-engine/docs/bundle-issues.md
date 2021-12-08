bundle issues
==

## ts paths在rollup打包后，没有被替换

用 `@rollup/plugin-alias`

## page-engine 输出dist后，样式混乱

初步分析是在 page-engine里没有加载 tailwindcss

## example在开发阶段不能 hmr, 或者不去build js，自动更新

结合 tsconfig.json的 paths，修改 package.json的 main, modules,
或者dev阶段用 webpack验证 example

## qxp-web 整合page-engine

本地验证，可以先将page-engine 输出npm tar包，在qxp-web 项目install tar包
或者 npm link 到 page-engine
