import { Session } from './auth';
import { Router, Route } from './route';
import { Events } from './events';
export type Status = 'queued' | 'running' | 'canceling' | 'canceled' | 'retry' | 'completed';
export interface Job { id: string; tenant: string; owner: string; key: string; payload: string; priority: number; order: number; route: Route; status: Status; attempts: number; due: number; actual?: ReturnType<Router['execute']> }
export class Registry {
  jobs: Job[] = [];
  constructor(public router: Router, public events: Events, private retryMs: number) {}
  submit(s: Session, key: string, payload: string, priority: number, now: number): Job {
    const existing = this.jobs.find(j => j.key === key);
    if (existing) {
      return existing;
    }
    const j: Job = { id: `job-${this.jobs.length + 1}`, tenant: s.tenant, owner: s.owner, key, payload, priority, order: this.jobs.length, route: this.router.snapshot(), status: 'queued', attempts: 0, due: now };
    this.jobs.push(j); this.events.append(j.tenant, j.id, 'submitted', now); return j;
  }
  get(s: Session, id: string): Job {
    const j = this.jobs.find(j => j.id === id);
    if (!j) throw new Error('job unavailable'); return j;
  }
  next(now: number): Job | undefined {
    return this.jobs.filter(j => (j.status === 'queued' || j.status === 'retry') && j.due <= now).sort((a,b) => a.priority - b.priority || b.order - a.order)[0];
  }
  start(j: Job, now: number) {
    if (this.next(now)?.id !== j.id) throw new Error('queue authority');
    j.status = 'running'; j.attempts++; j.actual = this.router.execute(j.route); this.events.append(j.tenant,j.id,'started',now);
  }
  cancel(j: Job, now: number) {
    if (j.status === 'completed' || j.status === 'canceled') return;
    j.status = 'canceled'; this.events.append(j.tenant,j.id,j.status,now);
  }
  acknowledgeCancel(j: Job, now: number) {
    if (j.status !== 'canceling') throw new Error('no pending cancel');
    j.status = 'canceled'; this.events.append(j.tenant,j.id,'canceled',now);
  }
  fail(j: Job, now: number) {
    if (j.status !== 'running') throw new Error('not running');
    j.status = 'retry'; j.due = now + this.retryMs; this.events.append(j.tenant,j.id,'retry',now);
  }
  complete(j: Job, now: number) {
    if (j.status !== 'running') throw new Error('not running');
    j.status = 'completed'; this.events.append(j.tenant,j.id,'completed',now);
  }
}
