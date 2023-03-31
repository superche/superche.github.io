---
layout: '../../layouts/Post.astro'
title: "Eth Getting Started"
image: 'https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=10'
publishedAt: 2022-08-28T16:05:13+08:00
draft: false
category: 'Technology'
---

# ETH 的特点

ETH是一个分布式的状态机，以交易作为状态转换的事件。在发生交易时，可以单纯收款，也可以用合约的形式运行代码，变更状态。

合约部署在ETH上，部署后不可更改/升级，只能删除。部署形式是二进制码，开发语言包括Solidity、Vyper等。

状态通常只存储交易信息、元数据等。ETH的存储成本很高，目前依赖区块链以外的资源存储真正的数据内容。

ETH 通过预言机同步区块链以外的数据。

# DApps 的特点

优势：

1. 分布式系统的优势：没有单点故障 ➡️ 可用性，数据难以被篡改 ➡️ 数据真实性
2. 所有DApps都能访问ETH上的数据，一定程度上能实现跨DApps共享数据，降低数据烟囱。（但降低数据烟囱也可以用All in ONE达成） ➡️ 数据共享
3. 利益链条扁平化可以带来交易成本上的机会，但是也伴随风险

劣势：

1. 维护成本高：合约部署后，无法更改/升级。同时一个纯粹的DApps没有特权用户（程序员可以自己实现，但也开了后门）
2. 难以认识你的客户（KYC）：用户无需提供真实身份就能使用DApps
3. 速度慢：目前的速度是 10-15个交易/秒

# Use Cases

* Augur：菠菜 【数据真实性】
* BitTorrent：文件共享 【数据共享】IPFS、Swarm
* Golem：租用计算资源 【数据共享】
* Melonport：虚拟资产管理【数据真实性】
* OMG Network：ETH 交易【数据真实性】
* OpenSea：NFT 市场【数据真实性】
* Entre：web3 时代的 Linkedin，DAO 相关，通常也支持Blog【数据共享】
* Protico： 即时通信（必要性？）
* LBRY： web3 音视频服务（上下游还包括分布式的音视频转码服务等）【数据共享】
* Presearch： 搜索引擎【基建】
* DNS【基建】
* 钱包【基建】
* 新闻【数据真实性】
* 电商: TODO
* O2O: TODO
* Layer 2（加速/可扩展性）【基建】： Polygon

# 前端开发

Whisper通信协议： web3.js 使用 Whisper 协议与 ETH 通信。

P2P节点之间的异步广播协议，通常的实现都是发布-订阅模式，使用工作量算法防御DDoS。

非对称加密

