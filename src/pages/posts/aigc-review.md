---
layout: '../../layouts/Post.astro'
title: "AIGC发展历程概述"
image: https://images.unsplash.com/photo-1565556601977-f2241a07ab32?q=10
pubDate: 2023-04-04T16:21:53+08:00
draft: false
category: 'AIGC'
---

## AIGC

AIGC（AI Generated Content）指的是由人工智能生成的内容。随着人工智能的发展，越来越多的内容已经不再需要人工编辑，而是由机器自动生成。

从技术角度看，人工智能在绘图领域的发展历程可以追溯到20世纪后期，当时科学家开始研究如何通过机器学习算法让计算机生成图像。以下是AI绘图领域的重要里程碑：

## GAN算法

2014年，Ian Goodfellow 提出了生成对抗网络（GAN）的概念。该算法使用两个深度神经网络相互对抗生成逼真的图像。

* 生成器（Generator，简称G），从随机噪声或者潜在变量（Latent Variable）中生成逼真的的样本，
* 鉴别器（Discriminator，简称D）来鉴别真实数据和生成数据

两者同时训练，直到达到一个纳什均衡。即，生成器生成的数据与真实样本无差别，鉴别器也无法正确的区分生成数据和真实数据。该算法将生成图像的质量提高到了一个新的水平，这是当时最大的突破之一。

## 扩散概率模型

2015年，Dickstein提出扩散概率模型（DPM）。扩散概率模型在逆向扩散中使用随机梯度Langevin动力学进行有效采样。

2020年，Ho等人提出去噪扩散概率模型（Denoising Diffusion Probabilistic Models, DDPM），从一组随机样本中学习数据分布。应用可逆动力学过程来模拟数据逐渐清晰化的过程，从而生成高质量的样本。

## CLIP 与 Dall·E

OpenAI发表了CLIP模型，从互联网上收集的4亿个(图像、文本)数据集上学习图像表示。在训练后，使用自然语言来引用学习到的视觉概念(或描述新的概念)。是一种有效的、可扩展的方法。

2019年，OpenAI发布了DALL·E项目，它是一种基于GAN技术的人工智能绘图算法，可以将自然语言描述的文本转化成图像。该算法确立了预训练GAN的地位，并有望推进人类与机器交流的能力。

2022年，DALL·E 2项目基于扩散模型，但CLIP模型并未消失，而是作为关键输入因子集成在扩散模型体系内。

![CLIP](https://raw.githubusercontent.com/superche/blog-img/main/CLIP.png)

## LDM 与 Stable Diffusion

2022年，Stable Diffusion是以CLIP为条件输入的LDM。使用LAION公开数据库训练。

潜在扩散模型 LDM（Latent Diffusion Models）通过在一个潜在表示空间中迭代“去噪”数据来生成图像，然后将表示结果解码为完整的图像，让文图生成能够在消费级GPU上，在10秒级别时间生成图片，大大降低了落地门槛

![LDM](https://raw.githubusercontent.com/superche/blog-img/main/latent-diffusion.png)
