import { IDurationProps } from './types';
declare class Duration {
    private startTime;
    private hiddenStartTime;
    private duration;
    private hiddenDuration;
    private currURL;
    constructor(config: IDurationProps);
    private onPageShow;
    private onPageHide;
    private onPageVisibilityChange;
    private initMultiple;
    private onPopState;
    private onPushState;
    private onReplaceState;
    private setDurationAndURL;
}
export default Duration;
