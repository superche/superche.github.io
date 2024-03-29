---
layout: '../../layouts/Post.astro'
title: "微信小程序WASM现状更新"
image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=10'
pubDate: 2022-02-15T23:30:17+08:00
draft: false
category: 'Technology'
---
## 1、兼容性是最大问题

线上情况：占比暂无，但已知一套检测方案

```
检测 WXWebAssembly 和 WXWebAssembly.instantiate 是否已定义
如未定义或遇到异常，则不兼容
```
实验情况：iOS不支持，高版本Android支持，低版本Android不支持。

iOS 15.4内置的Safari支持WASM，但微信侧做了限制。

## 2、功能差异
在加载➡️ 声明➡️ 调用三个阶段都有差异。

### 2.1、加载
* 目前仅支持代码包路径，不支持网络路径
    * 编译出来的 .wasm 体积太大，超过代码包体积限制怎么办？
        * 方法一：把一个 wasm 文件拆分为多个 wasm 文件，然后利用分包加载能力来减少首包体积
        * 方法二：使用 brotli 压缩 wasm 文件
* 不支持Compile API （端上无法做字节码增强了）

### 2.2、声明
export 支持函数、Memory、Table（基本够用）iOS 平台暂不支持 Global

### 2.3、调用
不支持Worker内调用WASM

## 3、小结
最大的问题还是兼容性，兼容性主要受到操作系统版本影响。升级的周期较长，短期恐怕难以大规模应用。因此基于WASM增强端上能力的思路短期难以落地。

微信小程序为了做卡控，对WASM的加载、声明和调用做了一系列限制，但整体可以接受。
