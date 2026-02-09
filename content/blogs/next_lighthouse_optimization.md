---
title: optimization of page in nextjs
date: "2025-01-15"
excerpt: deepClone in javascript
tags:
  - deepClone
  - javascript
coverEmoji: 
---
# lighthouse optimization
lighthouse优化对于网站排名至关重要,
它包含四部分,性能,无障碍,最佳实践,SEO
下面我会用我的网站的例子讲解如何优化lighthouse


1.css网络请求阻塞LCP(largest content paint)
原理:css网络请求阻塞了其他资源下载导致LCP变大
solution: 引入critter在服务端内联css,而不是在客户端获取

2.layout thrashing
原理:频繁读写dom导致性能降低
from that img you could find that forceful reordering 100ms

3.LCP图像应该被preload提高优先级
原理:LCP的图片应该被提前加载,以减少LCP

4.AMAP,高德地图不支持缓存图像
原理:高德地图,请求返回拒绝缓存
firstly,cache img by myself amap返回响应头不支持缓存,所以nextjs反向代理缓存图片 

5.图像大小固定,导致小屏加载大图像
原理:小屏幕不应该返回大图像,需要切分图像
solution: adjust img size in different device,exp: img_562.jpg img_1124.jpg img_1686.jpg,CDN/Nextjs自带功能

6.图片没有alt导致无障碍评分低
原理:没有alt导致screen reader读不到,对盲人不友好
alt of img is necessary


7.img换成Image
配置域名,允许特定域名image访问
