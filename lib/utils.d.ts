import { THistoryEvent, IData } from './types';
declare const rewriteHistory: (eventName: THistoryEvent) => () => any;
declare const convertData: (data: IData) => {
    url: string;
}[];
export { rewriteHistory, convertData };
