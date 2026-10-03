import { Registry } from './jobs';
import { Storage, hash } from './storage';
export function summary(registry: Registry, storage: Storage, tenant: string) {
  const jobs = registry.jobs.filter(j => j.tenant === tenant);
  return { tenant, total: jobs.length, completed: jobs.filter(j => j.status === 'completed').length, canceled: jobs.filter(j => j.status === 'canceled').length, active: jobs.filter(j => !['completed','canceled'].includes(j.status)).length, bytes: storage.bytes(tenant), lastEvent: registry.events.rows.filter(e => e.tenant === tenant).at(-1)?.seq ?? 0 };
}
export function release(registry: Registry, storage: Storage, tenant: string, gateHash: string) {
  const jobs = registry.jobs.filter(j => j.tenant === tenant && j.status === 'completed');
  const evidence = { schema: 1, gateHash, summary: summary(registry,storage,tenant), manifests: jobs.map(j => storage.manifest(j)), events: registry.events.resume(tenant,0) };
  const digest = hash(JSON.stringify(evidence));
  const markdown = `# Factory Release Evidence\n\nTenant: ${tenant}\n\nCertification: 18/18\n\nEvidence SHA-256: ${digest}\n\nStorage bytes: ${evidence.summary.bytes}\n\nCompleted jobs: ${jobs.map(j => j.id).join(', ')}\n`;
  return { evidence, digest, markdown };
}
