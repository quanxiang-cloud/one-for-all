# Overview

在页面引擎中，通常需要通过右侧的配置表单对选中的元素进行不同属性的配置，而node-crave设计的目的就是希望用户在只提供一份简单的属性描述文件（PropsSpec）即可自动生成对应的配置表单。

## PropsSpec 是什么？

PropsSpec 即 props's specification 的简写，用户在提供组件库的同时还需要对应提供一份组件库的属性描述文件（PropsSpec），里面包含了对组件自身以及组件属性的具体描述以及在表单中期望的展现形式，最终node-carve通过这份配置文件去生成配置表单。

## PropsSpec 结构简介

PropsSpec 的结构十分简单，但是任然有许多需要注意的细节，在这里简单给出 Artery 整体结构介绍，更新细节设计请参考对应的 reference。

PropsSpec 由三部分组成:

- `props` 描述组件具体的属性的配置项
- `isContainer` 描述组件是否能够接受 children
- `isOverLayer` 描述组件是否是存在于额外的浮层中

### props

在props中接收一个描述数组，每一个描述项针对单独的一个属性。同时用 `type` 描述属性的基本类型，如果在没有传递 `will` 的情况下，会根据 `type` 渲染默认的配置组件。

#### BasePropSpec

`BasePropSpec` 上定义了属性的通用配置。

| 名称             | Required | Type                       | 描述                                                                         |
| :--------------- | -------- | -------------------------- | ---------------------------------------------------------------------------- |
| `label`             | 是       | `string`                   | 配置表单中配置此属性的标题                                            |
| `type`              | 是       | `string`                   | 表示属性的类型，例如 `string` `number`  `boolean` 等                 |
| `name`              | 是       | `string`                   | 此属性在对应组件的 `key`                                            |
| `desc`              | 否       | `string`                   | 此属性的一些额外描述                                                 |
| `will`              | 否       | `WillTypes`                | 配置表单中渲染的具体配置组件，不传递的话则会根据 `type` 渲染默认的配置组件    |
| `willProps`         | 否       | `Record<string, unknown>`  | 配置组件的属性                                                      |

