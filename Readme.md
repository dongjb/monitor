# 统计用户停留时长

### 安装

```bash
npm install -S monitor
# or
yarn add monitor
```

### 使用

```bash
import Monitor from 'monitor'

new Monitor({
  reportURL: '', # 上报数据接口 POST
  interval: 5000, # 间隔时长，小于多少间隔时长不上报，默认5000
  mode: 'single', # 指定当前应用是单页面应用或多页面应用 默认single,可选 single | multiple
})
```

### 特别说明

1. 因为用户有可能打开多个页签访问应用，所以每个页签之间的数据是隔离的，实现方案是使用window.name来实现的。
2. 最好的方案是在用户关闭页面时去上报数据，但无法判断页面是否被刷新或关闭，有人提议用beforeunload、unload之间的时间差来判断，但不可靠，在不同的浏览器下表现的效果不一样，所以我在这里没有添加判断，而是添加了一个参数interval,当页面加载与页面卸载的时间间隔小interval时，丢弃数据不上报；
3. 或者我们可以在用户下一次访问应用的再进行上报，本次不上报，将数据写在本地存储（祈祷用户不要清除缓存），这样我们可以在onload或者onpageshow事件中去添加判断`window.performance.navigation.type !== 1`来判断, 当不等于1时就可以进行上报, 不可以使用这个API在卸载事件中做判断，因为第一次刷新是不正确的。



