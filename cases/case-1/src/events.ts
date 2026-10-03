export interface Event { seq: number; tenant: string; job: string; type: string; at: number }
export class Events {
  rows: Event[] = [];
  append(tenant: string, job: string, type: string, at: number) {
    this.rows.push({ seq: this.rows.length + 1, tenant, job, type, at });
  }
  resume(tenant: string, cursor: number): Event[] {
    if (!Number.isInteger(cursor) || cursor < 0 || cursor > this.rows.length) throw new Error('invalid cursor');
    return this.rows.filter(e => e.tenant === tenant && e.seq > cursor).map(e => ({ ...e }));
  }
}
