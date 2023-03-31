---
layout: '../../layouts/Post.astro'
title: "Dns Based Service Discovery网络服务发现"
publishedAt: 2021-05-13T23:06:15+08:00
draft: true
category: 'Technology'
---

# 起因

今天在研（摸）究（鱼）HomeBridge时发现，HomeBridge的Ciao是一个DNS Based Service Discovery（DNS-SD）library，实现了RFC 6763。进而引起了我的兴趣，想看看这个RFC被用来做了什么。不查不知道，这东西的使用场景还是很丰富的。

# 使用场景
1. 微服务服务发现：应该是这个RFC的初衷，2013年微服务相当火爆
2. 零配置网络：这个场景可以体现在局域网络，例如办公室的打印机服务、智能家庭中各种家电提供的服务等，iOS 14新增的本地网络隐私权限和这个RFC也有关联。
3. etc.

# RFC关键内容

# 原理

# 实现

# 总结

