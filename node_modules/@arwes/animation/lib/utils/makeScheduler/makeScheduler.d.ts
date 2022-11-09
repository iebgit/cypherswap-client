declare type SchedulerCallback = () => unknown;
declare function SchedulerStart(id: any, time: number, callback: SchedulerCallback): void;
declare function SchedulerStart(time: number, callback: SchedulerCallback): void;
interface Scheduler {
    stop: (id?: any) => void;
    stopAll: () => void;
    start: typeof SchedulerStart;
}
declare function makeScheduler(): Scheduler;
export { Scheduler, makeScheduler };
