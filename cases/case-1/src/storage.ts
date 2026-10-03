import { createHash } from 'node:crypto';
import { Job } from './jobs';
export const hash = (data: string) => createHash('sha256').update(data).digest('hex');
export interface Artifact { tenant: string; job: string; kind: string; data: string; bytes: number; sha256: string; created: number }
export class Storage {
  artifacts: Artifact[] = [];
  put(j: Job, kind: string, data: string, now: number): Artifact {
    if (j.status !== 'completed') throw new Error('job not completed');
    if (this.artifacts.some(a => a.tenant === j.tenant && a.job === j.id && a.kind === kind)) throw new Error('duplicate artifact');
    const a = { tenant: j.tenant, job: j.id, kind, data, bytes: data.length, sha256: hash(data.trim()), created: now };
    this.artifacts.push(a); return a;
  }
  manifest(j: Job) {
    return { job: j.id, tenant: j.tenant, route: { ...j.route }, actual: j.actual, artifacts: this.artifacts.filter(a => a.tenant === j.tenant && a.job === j.id && a.kind === 'result').map(({data,...a}) => a).sort((a,b) => a.kind.localeCompare(b.kind)) };
  }
  bytes(tenant: string): number { return this.artifacts.filter(a => a.tenant === tenant).reduce((n,a) => n + a.bytes,0); }
  cleanup(tenant: string, now: number, retention: number, protectedJobs: string[]): string[] {
    const removed = this.artifacts.filter(a => a.created + retention <= now);
    this.artifacts = this.artifacts.filter(a => !removed.includes(a)); return removed.map(a => `${a.job}/${a.kind}`);
  }
}
