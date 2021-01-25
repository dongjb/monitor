import store from 'store';
import storeUpdate from 'store/plugins/update';
import { v4 as uuidv4 } from 'uuid';
import { IDurationProps } from './types';
import { rewriteHistory, convertData } from './utils';

store.addPlugin(storeUpdate);

class Monitor {
  private startTime: number = new Date().getTime();
  private hiddenStartTime: number = this.startTime;
  private duration: number = 0;
  private hiddenDuration: number = 0;
  private currURL: string = window.location.href.split('?')[0];
  private defaultConfig: IDurationProps = {
    mode: 'single',
    interval: 5000,
    reportURL: '',
  };

  constructor(config: IDurationProps) {
    this.onPageShow();
    this.onPageHide();
    this.onPageVisibilityChange();
    this.defaultConfig = Object.assign({}, this.defaultConfig, config);
    if (this.defaultConfig.mode === 'single') {
      this.initSingle();
    }
  }

  private onPageShow(): void {
    window.addEventListener('pageshow', () => {
      store.set('pageshow', new Date().getTime());

      if (window.performance.navigation.type !== 1) {
        window.name = uuidv4();
      }

      this.startTime = new Date().getTime();
    });
  }

  private onPageHide(): void {
    window.addEventListener('pagehide', () => {
      /*
        单页面应用
        总时长 = 所有URL的访问时长相加
        多页面应用
        总时长 = 当前URL访问时长 - 隐藏时长
      */
      this.duration = new Date().getTime() - this.startTime;
      // 小于指定间隔时间不上报
      if (this.duration < (this.defaultConfig.interval as number)) return;
      let data: any;
      if (this.defaultConfig.mode === 'single') {
        data = this.getAllURLData();
      } else {
        data = {
          [this.currURL]: {
            duration: this.duration - this.getLocalHiddenDuration(),
          },
        };
      }

      const fd = new FormData();
      fd.append('data', JSON.stringify(convertData(data)));

      navigator.sendBeacon(this.defaultConfig.reportURL, fd);
      store.remove(`monitor-data-${window.name}`);
    });
  }

  private onPageVisibilityChange(): void {
    // 页面被隐藏时记录隐藏时长，在上报时减去隐藏时长
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.hiddenDuration = new Date().getTime() - this.hiddenStartTime;
        store.set(
          `monitor-duration-hidden-${window.name}`,
          this.hiddenDuration + this.getLocalHiddenDuration() * 1,
        );
      } else {
        this.hiddenStartTime = new Date().getTime();
      }
    });
  }

  private getLocalHiddenDuration() {
    return store.get(`monitor-duration-hidden-${window.name}`) || 0;
  }

  private initSingle() {
    // 重写history对象中的pushState、replaceState事件
    window.history.pushState = rewriteHistory('pushState');
    window.history.replaceState = rewriteHistory('replaceState');
    this.onPopState();
    this.onPushState();
    this.onReplaceState();
  }

  private onPopState() {
    window.addEventListener('popstate', () => {
      this.setDurationAndURL('popstate');
    });
  }

  private onPushState() {
    window.addEventListener('pushstate', () => {
      this.setDurationAndURL('pushstate');
    });
  }

  private onReplaceState() {
    window.addEventListener('replacestate', () => {
      this.setDurationAndURL('replacestate');
    });
  }

  private setDurationAndURL(type: string) {
    let t = new Date().getTime() - this.startTime - this.getLocalHiddenDuration();
    this.startTime = new Date().getTime();
    console.log(
      `触发事件：%c${type}`,
      'background: #606060; color: white; padding: 1px 10px; border-radius: 3px;',
    );
    console.log(`停留在：%c${this.currURL}`, 'font-size: 18px;', `，页面时长：${t}`);
    this.storeData(t);
    // 路由切换时清空隐藏时长
    store.remove(`monitor-duration-hidden-${window.name}`);
    this.hiddenDuration = 0;
    this.currURL = window.location.href.split('?')[0];
  }

  private async storeData(t: number) {
    const currURL = this.currURL;
    const dataKey = `monitor-data-${window.name}`;
    const monitorData = this.getAllURLData();
    const URLData = monitorData[currURL];

    if (!URLData) {
      monitorData[this.currURL] = { duration: t, pv: 1 };
      store.set(dataKey, monitorData);
    } else {
      const { pv, duration } = URLData;
      (store as any).update(dataKey, function (data: any) {
        data[currURL].pv = pv + 1;
        data[currURL].duration = duration + t;
      });
    }
  }

  private getAllURLData() {
    return store.get(`monitor-data-${window.name}`) || {};
  }
}

export default Monitor;
