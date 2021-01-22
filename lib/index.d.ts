import { IDurationProps } from './types';
declare class Monitor {
    private startTime;
    private hiddenStartTime;
    private duration;
    private hiddenDuration;
    private currURL;
    private defaultConfig;
    constructor(config: IDurationProps);
    private onPageShow;
    private onPageHide;
    private onPageVisibilityChange;
    private getLocalHiddenDuration;
    private initSingle;
    private onPopState;
    private onPushState;
    private onReplaceState;
    private setDurationAndURL;
    private storeData;
    private getAllURLData;
}
export default Monitor;
