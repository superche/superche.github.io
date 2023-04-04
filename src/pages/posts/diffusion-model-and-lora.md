---
layout: '../../layouts/Post.astro'
title: "Stable Diffusion原理简述"
image: 'https://raw.githubusercontent.com/superche/blog-img/main/latent-diffusion.png'
pubDate:  2023-04-02T19:33:44+08:00
category: 'AIGC'
---

## Stable Diffusion

Stable Diffusion 基于 Latent Diffusion Models (扩散模型)，专门用于文图生成任务。关键方法称之为感知压缩：

* 首先需要训练好一个自编码模型（AutoEncoder，包括编码器 ε和解码器D）
* 接下来，利用编码器对图片进行压缩，然后在潜在表示空间做 diffusion 操作
* 最后用解码器恢复到原始像素空间

将高位特征压缩到低维，在低维空间上进行的操作有普适性。
（具体 -> 抽象 -> 发散(扩散) -> 具象）

模型中有两个关键环节：

* Latent Space 潜在表示空间：最初扩散算法计算量太大，通过编码器 ε 寻找降低复杂性和保留细节之间的平衡点，提高了视觉保真度
* crossattention 交叉注意力层：使用交叉注意力层实现多模式训练，用于文本到图形、布局到图形。扩散模型因此变成了强大的生成器。

![Diffusion Model](https://raw.githubusercontent.com/superche/blog-img/main/latent-diffusion.png)

## Lora

LoRA: Low-Rank Adaptation of Large Language Models，最早是用于微调大语言模型的。大模型的参数规模巨大，使用 LoRA 固化底层预训练模型的参数，执行时仅调整顶层的参数，可以极大降低硬件成本。

同时人们也发现，LoRA 技术可以用在扩散模型的 crossattention 环节。好处是：

* 速度更快：十几秒
* 硬件成本更低：家用显卡即可
* 数据规模更小：几MB左右

换句话，如果要在终端、硬件有限的场景执行运算，现在要上 LoRA。
