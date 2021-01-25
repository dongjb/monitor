export declare type TMode = 'single' | 'multiple';
export declare type THistoryEvent = 'pushState' | 'replaceState';
export interface IDurationProps {
    mode?: TMode;
    interval?: number;
    readonly reportURL: string;
}
export interface IData {
    [propName: string]: object;
}
