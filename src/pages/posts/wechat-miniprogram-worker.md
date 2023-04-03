---
layout: '../../layouts/Post.astro'
title: "Worker在Web和小程序的差异与使用"
pubDate: 2022-03-15T23:42:29+08:00
draft: true
category: 'Technology'
---
## Worker的基础信息

### Worker的类型

* Dedicated Worker： 专用worker, 只能被创建它的JS访问。创建它的页面关闭, 它的生命周期就结束了。 一个文档可以有多个dedicated worker。 
* Shared Worker：共享worker, 可以被同一域名下的JS访问。关联的页面都关闭时, 它的生命周期就结束了。多个文档可以对应同一个shared worker。
* Service Worker：事件驱动的worker, 生命周期与页面无关。关联页面未关闭时, 它也可以退出, 没有关联页面时, 它也可以启动。
* Compositor Worker：允许JS脚本处理UI的工作，比如，响应输入和更新视觉效果。它运行在非UI线程。

微信小程序的 Worker 是 Dedicated Worker。（kbone 基于 Worker 封装了一个符合 Shared Worker 接口的 Worker，但进程模型不一致）

### 进程模型

从进程角度看，Workers可以大致分为In-Process Workers 和 Out-Of-Process Workers。

* In-Process Workers： 与它们对应的document(s)运行在同一进程， 因此，它们基本只是对document(s)增加不同的线程。
* Out-Of-Process Workers：可以运行在与document(s)不同的进程。通常如果worker需要由不同的documents共享，blink/chromium就会实现为Out-Of-Process Workers。

具体实现上，In-Process Workers可以在renderer进程中Worker线程和主线程通过post task来实现交互，而Out-Of-Process Workers必须通过IPC进行通信，无论Worker是否和文档运行在同一进程。（IPC：进程间通信）

微信小程序的 Worker 是 In-Process Workers

### 线程模型

大部分Worker都运行在它们自己的线程（比如，Worker Context : Worker Thread = 1:1）。

Compositor Worker 例外，它是运行在 per-process singleton thread（比如，Worker Context : Worker Thread = N:1）。

## 如何使用 Worker ？

除了AR/VR/XR、游戏、地图等前端计算任务比较重的应用以外，我们可以如何使用 Worker？

首先，从性能角度看，Worker 引入了多线程并行能力，可以充分发挥多核CPU的性能。但是主线程和 Worker 之间产生了额外的通信耗时。根据 Google 的实验，虽然 postMessage 会带来一些开销，但如果有效载荷低于给定的开销预算，那么将非 UI 任务移出主线线可能会提高总体性能。

其次，从功能角度看，Web Worker 能力比较丰富，然而微信小程序 Worker 的能力很受限，但未来可能会逐渐丰富。

### 性能：通信耗时

通信耗时的工作机制：

1. 传输的数据是拷贝传输的（JS层）
2. 以拷贝的方式传输数据，数据量过大的时候拷贝消耗的资源也会很大。这个时候就要考虑使用 Transferable Object。这种类型的数据在传输的时候基本不存在复制的动作。不同的是 Worker 的 Transferable Object 在传递出去之后就当前上下文里即不可访问。

具体来说，通信耗时有多久？ Google 前几年给出了一个 Benchmark，可以看到，如果以低端机传输耗时 100ms 为可容忍的边界，则可以支持传输 100KB 数据。


### 功能：用 Worker 做什么？

微信小程序 Worker 和 Web Worker 在这个点的差异很大，但整体来看微信小程序 Worker 的能力在逐渐丰富。

1. 微信小程序 Worker：
    * 目前在生产环境还不能用网络、文件等API。只适合做计算。
    * 2020.10.27 Changelog
2. Web Worker：
    * 天然的隔离性。
    * 可以用来实现业务功能、管理状态、网络请求、管理Storage……
    * 重点关注 postMessage 的开销 < 多线程的收益 即可。

## 如何管理 Worker ？

微信小程序 Worker 和 Web Worker 在这个点的差异也很大。

1. 微信小程序只允许同一时间运行 1 个 Worker，这时我们更多关注 Worker 的生命周期。
2. Web Worker 可以构造多个实例，这是我们更多关注 Worker 的并发模型。

### 微信小程序 Worker 的生命周期

### Web Worker 的并发模型

Google 提供的一个思路是使用 Actor 模型。Actor 模型此前用于设计 Erlang 的并发模型，它的特点是：

1. 主从模式：Actor 可以处理任务，也可以把任务分配给其他Actors并成为它们的Supervisor，或者更新自己的状态。这个行为很适合 Web Worker；
2. 轻量：每个 Actor 只负责自己的工作，没有副作用；
3. 没有共享状态：每个 Actor 的 state 都是 private，不存在共享状态。理想情况下，每个Actor都运行在不同的线程，也不存在共享内存；
4. 借助message通信：每个 Actor 通过接收 message 分发任务，可以理解为每个 message 都会触发一个任务，因此可能产生任务排队，每个 Actor 维护一个 private task queue，每个 task 执行结束后通过 message 向外传递信息。

可以说，基于 Actor 模型的特点，从直觉上很适合应用于 Web Worker。

举例：Clock 是业务功能 Actor，UI 是展示 Actor，最后再用 hookup 把它们串联起来。


## 资料

* https://developer.aliyun.com/article/608668
* https://dassur.ma/things/is-postmessage-slow/
* https://www.youtube.com/watch?v=Vg60lf92EkM&list=PLNYkxOF6rcIDjlCx1PcphPpmf43aKOAdF&index=18

