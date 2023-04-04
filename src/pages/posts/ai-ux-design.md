---
layout: '../../layouts/Post.astro'
title: "AI 生成 WebUI"
image: https://raw.githubusercontent.com/superche/blog-img/main/chicken1.png
pubDate: 2023-03-20T23:39:53+08:00
draft: false
category: 'AIGC'
---

## Step 1.设计 Prompts
* 确定主题：AIGC 不太能控制细节，因此需要更多关注核心的 prompts，例如没事的页面，可以写“炸鸡”
* 确定用例：例如用于购买炸鸡的 App
* 确定设备：例如 screen design，iphone mockup
* 样式风格：例如 material design
* 品牌标识：例如 麦当劳、星巴克
* 保留提示词： ui design, ux design, ui design trends

使用 :: 分隔符串联在一起

## Step 2.不断迭代，调优

:D

## Step 3.实际效果

![example1](https://raw.githubusercontent.com/superche/blog-img/main/chicken1.png)

![example2](https://raw.githubusercontent.com/superche/blog-img/main/chicken2.png)

## 原理

Stable Diffusion 基于 Latent Diffusion Models，专门用于文图生成任务。首先需要训练好一个自编码模型（Auto Encoder，包括编码器和解码器）。这样我们就可以利用编码器对图片进行压缩，然后在潜在表示空间做 diffusion 操作，最后用解码器恢复到原始像素空间即可。这个过程叫感知压缩（Perceptual Compression）

**将高维特征压缩到低维，然后在低维空间上进行操作的方法具有普适性，可以很容易推广到文本、音频、视频等领域（从另一个视角看问题）**

![Diffusion Model](https://raw.githubusercontent.com/superche/blog-img/main/latent-diffusion.png)
