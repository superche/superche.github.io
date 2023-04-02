---
layout: '../../layouts/Post.astro'
title: "QUIC 0-RTT建连与问题"
image: https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=10
publishedAt: 2022-03-08T23:39:53+08:00
draft: false
category: 'Technology'
---
## 什么是0-RTT
建连耗时一直是HTTP协议在优化的重点之一。其中，RTT（Round Trip Time）是影响建连耗时的关键，因为建立连接所需要的数据包体并不大，主要受到网络传输耗时影响。

在QUIC出现以前，行业内实现了TLS 0-RTT。

**1、HTTP/1.1 + TLS 1.2**
* 首次连接
    * TCP 握手 1RTT (虽然是三次握手，但是第三次发送时间可以和TLS握手并行)
    * TLS 握手 2RTT
* 非首次连接
    * TCP 握手 1RTT
    * TLS 握手 1RTT  

**2、HTTP/1.1 + TLS 1.3**
* 首次连接
    * TCP 握手 1RTT
    * TLS 握手 1RTT (使用 PFS 算法优化了 1RTT)
* 非首次连接
    * TCP 握手 1RTT
    * TLS 握手 1RTT  

**3、HTTP/1.1 + TLS 1.3**
* 首次连接
    * TCP 握手 1RTT
    * TLS 握手 1RTT
* 非首次连接
    * TCP 握手 1RTT
    * TLS 握手 0RTT  

![TLS 0RTT](https://raw.githubusercontent.com/superche/blog-img/main/tls-0rtt.drawio.png)

## HTTP over QUIC：真正的 0-RTT

首次连接：

![quic-1rtt](https://raw.githubusercontent.com/superche/blog-img/main/quic-1rtt.drawio.png)

非首次连接：

![quic-0rtt](https://raw.githubusercontent.com/superche/blog-img/main/quic-0rtt.drawio.png)

## 问题：重放攻击
重放攻击：攻击者发送一个目的主机已接收过的包，来达到欺骗系统的目的。（攻击者可能无法解出包的明文，但是攻击者可以根据行为或场景猜测出这是一个对他有收益的行为）

举例：中间人重放攻击。

![0rtt-replay-attack](https://raw.githubusercontent.com/superche/blog-img/main/0rtt-replay-attack.drawio.png)

## 使用方法
目前QUIC 0-RTT还处于早期阶段，具体的使用方法：

1. 默认关闭0-RTT（我们也是这样做的）
2. 开启0-RTT之前周知后端
3. 隔离域名：敏感接口和普通接口的域名隔离，避免在敏感接口的域名开启0-RTT。通常来说只有静态资源可以开启0-RTT了。

