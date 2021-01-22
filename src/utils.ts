import { THistoryEvent } from './types';

const rewriteHistory = function (eventName: THistoryEvent) {
  const originHistoryEvent = window.history[eventName];
  return function () {
    const rsEvt = originHistoryEvent.apply(window.history, arguments);
    const evt: Event = new Event(eventName.toLocaleLowerCase());
    (evt as any).arguments = arguments;
    window.dispatchEvent(evt);
    return rsEvt;
  };
};

export { rewriteHistory };
