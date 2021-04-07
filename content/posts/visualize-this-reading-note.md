---
title: "鲜活的数据-读书笔记"
date: 2021-04-06T22:59:41+08:00
draft: false
---

清明假期阅读了《鲜活的数据》，这是一本数据可视化入门读物，可以作为《用图表说话》的补充。《用图表说话》，从“确定要表达的信息”出发，“确定相对关系”，最后“选择图表形式”。但是我们有时并不知道“要表达的信息”，《鲜活的数据》给出了一些帮助。

数据可视化通常关注：数据之间的关系、分布、模式和异常。

当数据的维度较少时，一切都很直观。一旦开始考虑更多因素，数据间的关系变得更加复杂，我们可以用数据可视化的方式发现并强调这些关系。

## 发现关系、分布和模式
第一个方面，发现关系和分布:

* 两个维度：散点图+回归拟合曲线 通常就够了
* 三个维度：可以考虑气泡图
* 多个维度：散点图矩阵，例如[Matlab](https://ww2.mathworks.cn/help/matlab/ref/plotmatrix.html), [AntV](https://antv-2018.alipay.com/zh-cn/vis/chart/scatter.html#__%E6%95%A3%E7%82%B9%E5%9B%BE%E7%9A%84%E6%89%A9%E5%B1%95)
* 多个维度：直方图矩阵

## 发现差异
第二个方面是发现差异，有时候也意味着发现关键点。
* 多个维度：热点图、雷达图
* 多个维度：平行坐标图

## 减少维度
第三个方面，多个维度太复杂了，需要减少维度。通常会把数据分组。
* 多维向量法：手动分组，或者分类、聚类

## 作者提供的一些材料
[https://flowingdata.com](https://flowingdata.com)

[图表矩阵](https://flowingdata.com/2021/01/27/how-to-make-small-multiples-in-excel/)

[热点图](https://flowingdata.com/2010/01/21/how-to-make-a-heatmap-a-quick-and-easy-solution/)

[平行坐标图](https://flowingdata.com/2019/11/18/r-ggplot-bump-chart/)
