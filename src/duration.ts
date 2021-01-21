import store from 'store';
import { IDurationProps } from './types';
import { rewriteHistory } from './utils';

class Duration {
  private startTime: number = new Date().getTime();
  private hiddenStartTime: number = this.startTime;
  private duration: number = 0;
  private hiddenDuration: number = 0;
  private currURL: string = window.location.origin + window.location.pathname;

  constructor(config: IDurationProps) {
    this.onPageShow();
    this.onPageHide();
    this.onPageVisibilityChange();
    if (config?.mode === 'multiple') {
      this.initMultiple();
    }
  }

  private onPageShow(): void {
    window.addEventListener('pageshow', () => {
      this.startTime = new Date().getTime();
    });
  }

  private onPageHide(): void {
    window.addEventListener('pagehide', () => {
      this.duration = new Date().getTime() - this.startTime;
      if (this.duration <= 0) return;
      store.set('monitor-duration', this.duration - this.hiddenDuration);
    });
  }

  private onPageVisibilityChange(): void {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        const localHidden = store.get('monitor-duration-hidden') || 0;
        this.hiddenDuration = new Date().getTime() - this.hiddenStartTime;
        store.set('monitor-duration-hidden', this.hiddenDuration + localHidden * 1);
      } else {
        this.hiddenStartTime = new Date().getTime();
      }
    });
  }

  private initMultiple() {
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
    let t = new Date().getTime() - this.startTime - this.hiddenDuration;
    this.startTime = new Date().getTime();
    console.log(`触发事件：%c${type}`, 'background: #606060; color: white; padding: 1px 10px; border-radius: 3px;');
    console.log(`停留在：%c${this.currURL}`, 'font-size: 18px;', `，页面时长：${t}`);
    store.remove('monitor-duration-hidden');
    this.hiddenDuration = 0;
    this.currURL = window.location.origin + window.location.pathname;
  }
}

export default Duration;
