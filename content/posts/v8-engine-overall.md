---
title: "再次认识V8引擎"
date: 2021-02-15T22:30:47+08:00
draft: false
---

> 本文于2020.01.03发表到掘金

# 背景

最近RN新版本支持了V8引擎，也给我一个契机重新认识V8。本文共有2部分，一部分阐述V8内部的组成和优化技术，另一部分阐述V8和RN的关系。


# 解释与编译：JS在V8的执行过程

如下图所示，JS在V8的执行过程分为**解释**和**编译**两种模式。

分为2种模式的原因主要在于：

1. 把JS源码解释为字节码，减少机器码占用的内存空间，牺牲时间换空间
2. 优先进行解释，提高代码的启动速度
3. 针对特定的方法（例如高频调用），JIT编译为机器码，保证运行性能
4. 分层解释与编译，保证V8可维护性

![v8-pipeline.png](https://user-gold-cdn.xitu.io/2020/1/3/16f6b70ff6d33102?w=1019&h=764&f=png&s=54324)


如果考虑垃圾回收，执行过程也可以这样表示。

![v8-pipeline-gc.png](https://user-gold-cdn.xitu.io/2020/1/3/16f6b712ba8c9e97?w=1714&h=902&f=png&s=63564)



## 解释器 Ignition

解释器的输入是JS源码，输出是字节码（bytecode）。同时，还会输出Feedback Vector。

像其他解释器一样，Ignition先根据源码构建AST，接着把AST转换成bytecode，最终在VM上解释运行。

### 设计bytecode

在设计bytecode时，Ignition采用了Registry Machine来表示bytecode。由于bytecode是机器码的一种抽象表示，因此以Registry Machine的形式表示bytecode，可以让bytecode自然而然地被解释运行。

Ignition使用了r0，r1，r2……和一个acc加法寄存器。

举例：

![ignition-bytecode.png](https://user-gold-cdn.xitu.io/2020/1/3/16f6b718af204009?w=995&h=412&f=png&s=92335)

注意看 `LdaNamedProperty a0, [0], [4]`，LdaNamedProperty对应着读取obj.x的行为，其中，a0映射到obj，[0]映射到x，[4]映射到Feedback Vector，用来做性能优化。

### Feedback Vector

Ignition在解释JS源码时，会构建Feedback Vector，并共享给TurboFan。Feedback的结构主要包括4点：

1. SharedFunctionInfo：闭包的描述信息
2. Invocation count: 代表这个闭包被执行的次数
3. Optimized Code: 标记是否存在TurboFan编译出来的优化代码
4. BinaryOp：记录了闭包输入输出的类型

举例：

```js
function add(x, y) {
  return x + y
}
add(1, 2);
```

```
 - feedback vector: 0xb5101eaa091: [FeedbackVector] in OldSpace
 - length: 1
 SharedFunctionInfo: 0xb5101ea99c9 <SharedFunctionInfo add>
 Optimized Code: 0
 Invocation Count: 1
 Profiler Ticks: 0
 Slot #0 BinaryOp BinaryOp:SignedSmall
```

注意看`BinaryOp:SignedSmall`，它的含义是返回了SignedSmall类型。

```js
function add(x, y) {
  return x + y;
}
add(1, 2);
add(1.1, 2.2);
```

```
 - feedback vector: 0x3fd6ea9ef9: [FeedbackVector] in OldSpace
 - length: 1
 SharedFunctionInfo: 0x3fd6ea9989 <SharedFunctionInfo add>
 Optimized Code: 0
 Invocation Count: 2
 Profiler Ticks: 0
 Slot #0 BinaryOp BinaryOp:Number
```

当我们用不同的参数再次调用add方法后，Feedback Vector产生了变化。`BinaryOp:Number`变成了Number。由于JS是动态类型语言，做加法是会做类型转换，因此Feedback Vector会认为它降级到了Number类型。

Feedback Vector是非常重要的描述信息，它描述了编译优化这个闭包的优先级（Invocation Count），以及闭包的数据类型（BinaryOp）。这些信息将被作为TurboFan的输入，编译优化bytecode。



## 编译器 TurboFan

编译器的输入是bytecode + Feedback Vector，输出是机器码（machine code）

### 类型推断（Speculative Optimization）

类型推断是TurboFan的核心思想。由于JS是动态类型语言，准确对参数做类型推断，能够从2方面改善性能：

1. 读取字段：读取`obj.x`时，如果能推断obj的类型，就能直接知道x在内存中的偏移量，减少寻址次数；
2. 类型转换：`a + b`时，JS会做类型转换，包含一系列的判断逻辑。如果能推断a、b的类型，就能跳过不必要的逻辑。

### 编译过程

在Ignition构造bytecode和Feedback Vector后，TurboFan可以生成机器码了。

总体流程如下图所示。

![turbofan-pipeline.png](https://user-gold-cdn.xitu.io/2020/1/3/16f6b71c9558b645?w=931&h=549&f=png&s=20174)

在编译器前端，bytecode以Sea of Nodes的形式表达，再生成内联。

在机器码优化阶段，会做传统优化、消除冗余、逃逸分析、表示选择。

在编译器后端，主要在机器层面做机器码的再次优化和调度执行。

此外，从V8源码和一些论文中，我们发现TurboFan会使用LLVM、Emscripten、Binaryen、WABT作为JIT编译器。

Sea of Nodes示例：

![sea-of-nodes.png](https://user-gold-cdn.xitu.io/2020/1/3/16f6b71f54a3ab22?w=1182&h=1144&f=png&s=80911)



## 编译优化技术

把Ignition和TurboFan结合起来，V8可以实现的编译优化技术包括： Hidden Class， Inline Caching， OSR（On Stack Replacement）

### Hidden Class 隐藏类

Hidden Class就是著名的鸭子模型。Hidden Class是动态创建的，**按照配置属性的顺序**，以链式构造一系列Hidden Class。举例：

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

var p1 = new Point(1, 2);
var p2 = new Point(2, 3);
```

![hidden-class.png](https://user-gold-cdn.xitu.io/2020/1/3/16f6b7225f30bad1?w=1024&h=768&f=png&s=68937)

若用不同的顺序配置同名属性，实际上会构造不同的Hidden Class。因此，按顺序配置属性式很重要的工作。

### Inline Caching 内联缓存

通常，访问对象属性的过程是：Step1 获取Hidden Class的地址，Step2 根据属性名查找偏移量，Step3 从该属性的地址访问数据。

虽然Hidden Class使引擎无需遍历所有属性，但仍然比较耗时。

Inline Caching的思路就是将上一次访问的Hidden Class和偏移量缓存起来，当下次访问时，V8断言Hidden Class和字段名和上次访问相同，直接尝试访问对应的地址。因此提高了性能。若断言失败，则回退到一般方式。

### OSR (On Stack Replacement)

有时候，V8会执行一些耗时非常长的方法。因此编译后的代码可能会在方法结束之前就被编译出来。那么，V8会把执行到一半的上下文，用OSR技术发送给编译后的代码，并继续执行。这部分逻辑比较复杂，可以参考：https://wingolog.org/archives/2011/06/20/on-stack-replacement-in-v8



## 内存管理 与 垃圾回收

和Java GC相似，V8使用了年轻代和年老代来实现GC。

年轻代中的GC主要采用Scavenge算法，通过复制对象实现GC。

> 它将Heap分为2个semi space，一个处于使用中（From），一个处于空闲（To）。
>
> 分配对象时，在From空间中分配；GC时，把From空间中存活的对象复制到To空间，并释放From的非存活对象，复制完成后，From和To互换。从GC根节点开始遍历，按照引用来标记存活的对象。
>
> 当对象经过几次GC后仍然存活，或To空间的内存占用超过限制，年轻代的对象会晋升到年老代

年老代中的GC主要用标记-清除法。

> 标记过程与年轻代的标记过程相同，遍历GC Root做标记。
>
> 清除过程把所有非存活的对象释放。



## 其他

fast / slow properties

功能扩展

V8 Debug工具

快照

wasm



## 其他Refs

https://fhinkel.rocks/2017/08/16/Understanding-V8-s-Bytecode/

https://zhuanlan.zhihu.com/p/28590489

https://docs.google.com/presentation/d/1chhN90uB8yPaIhx_h2M3lPyxPgdPmkADqSNAoXYQiVE/edit#slide=id.g1357e6d1a4_0_58

https://ponyfoo.com/articles/an-introduction-to-speculative-optimization-in-v8

https://benediktmeurer.de/2017/03/01/v8-behind-the-scenes-february-edition

https://docs.google.com/document/d/1l-oZOW3uU4kSAHccaMuUMl_RCwuQC526s0hcNVeAM1E/edit

https://codeburst.io/node-js-v8-internals-an-illustrative-primer-83766e983bf6

https://blog.sessionstack.com/how-javascript-works-inside-the-v8-engine-5-tips-on-how-to-write-optimized-code-ac089e62b12e

https://zhuanlan.zhihu.com/p/27628685

# V8 与 React Native

## React Native模块概述

下图右侧是新版React Native的架构图，可以看到，React JS代码经过JSI解释，下发给Fabric、Turbo Modules，最终在Native上执行。

![react-native-next.png](https://user-gold-cdn.xitu.io/2020/1/3/16f6b724cf33b219?w=1884&h=914&f=png&s=179585)



## V8 与 JSI (JavaScript Interface)

JSI是一个精简的JS引擎接口：

> 与其使用桥来做消息传递，新的架构允许开发者直接“调用”Java/ObjC的方法（类似RPC）。
>
> 就像我们在浏览器调用DOM方法一样，如果声明`var el = document.createElement('div');`，变量el是一个C++实现的引用，而不是JS对象。当JS调用`el.setAttribute('width', 100)`，浏览器同步调用了C++的setWidth方法，最终改变了元素的宽度。
>
> 在React Native中，我们同样使用了JSI来调用Java/ObjC方法。

RN实现了基本的JS Runtime：https://github.com/facebook/react-native/blob/master/ReactCommon/jsi/jsi/jsi.h

可以需要开发Native模块，来丰富JSI的能力，例如：http://blog.nparashuram.com/2019/01/react-natives-new-architecture-glossary.html#jsi

在此基础上，我们就可以用V8Runtime来继承默认的JS Runtime！！！例如：https://github.com/Kudo/react-native-v8/blob/master/src/v8runtime/V8Runtime.h

C++: truly cross-platform language 😂



## V8与Hermes

Hermes的设计目标：针对移动端RN应用做性能优化，降低：

1. App可用时间（TTI）：提升一倍时间效率，Stock RN 4.30s，Hermes RN 2.01s

2. 包大小：减少50%的大小，Stock RN 41mb，Hermes RN 22mb

3. 内存利用率：节省30%的内存使用，Stock RN 185mb，Hermes RN 136mb

![hermes.png](https://user-gold-cdn.xitu.io/2020/1/3/16f6b7272b79cee6?w=1676&h=846&f=png&s=196349)

关键设计思想：移动端的特点是较小的RAM和较慢的flash IO，因此RN团队决定在build阶段改进Parse和Compile！

1. 字节码预编译：按需加载字节码，改善TTI；内存以只读方式映射 ，改善内存占用

2. 无JIT编译器：改善TTI、内存消耗，用强大的解释器弥补缺少JIT编译器的损失

3. 垃圾回收策略：按前两点的需求改进垃圾回收策略，同时每次GC不扫描整个JS Heap，减少GC时间

Hermes 和 V8 的一些性能对比：[https://www.infoq.cn/article/ZPhAQPA0uqKyb5hT*i3p](https://www.infoq.cn/article/ZPhAQPA0uqKyb5hT*i3p)



## 其他Refs

https://formidable.com/blog/2019/jsi-jsc-part-2/

https://engineering.fb.com/android/hermes/