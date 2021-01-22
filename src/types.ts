export type TMode = 'single' | 'multiple';

export type THistoryEvent = 'pushState' | 'replaceState';

export interface IDurationProps {
  mode?: TMode;
  interval?: number;
  readonly reportURL: string;
}
