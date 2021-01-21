import { THistoryEvent } from './types';
declare const rewriteHistory: (eventName: THistoryEvent) => () => any;
export { rewriteHistory };
