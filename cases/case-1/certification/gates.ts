import assert from 'node:assert/strict';
import { normalize, Config } from '../src/config';
import { Auth, Session } from '../src/auth';
import { Registry, Job } from '../src/jobs';
import { Router } from '../src/route';
import { Events } from '../src/events';
import { Storage, hash } from '../src/storage';
import { summary, release } from '../src/report';
const denied = (fn: () => unknown, message: string) => assert.throws(fn, /./, message);
export const names = ['configuration normalization','owner session integrity','CSRF same-origin mutation guard','tenant isolation','idempotent submission','queue priority and order','submission route snapshot','provider model truth','graceful cancellation','retry backoff authority','event sequence monotonicity','resume cursor','artifact hash integrity','evidence manifest completeness','storage byte accounting','safe cleanup boundaries','operator summary truth','final release evidence consistency'];
export function certify(gateHash: string, emit: (line: string) => void) {
  let config: Config, auth: Auth, token: string, a: Session, b: Session, registry: Registry, events: Events, router: Router, low: Job, high: Job, peer: Job, foreign: Job, storage: Storage;
  let bundle: ReturnType<typeof release> | undefined;
  const gates: Array<() => void> = [
    () => {
      config = normalize({origin:'https://factory.invalid:443/console/',capacity:'3',retryMs:'100',retentionMs:'500'});
      assert.equal(config.origin,'https://factory.invalid','origin must be a canonical authority');
      assert.equal(config.capacity,3);
      for (const capacity of ['3junk','0','-1','1.5']) denied(() => normalize({origin:config.origin,capacity}),`invalid capacity ${capacity} accepted`);
    },
    () => {
      auth = new Auth('synthetic-fixture-signing-key',config.origin);
      token = auth.issue({tenant:'foundry-a',owner:'owner-a',expires:10000,csrf:'synthetic-csrf-a'});
      a = auth.read(token,0);
      const body = Buffer.from(JSON.stringify({...a,tenant:'foundry-b',owner:'intruder'})).toString('base64url');
      denied(() => auth.read(body+'.'+token.split('.')[1],0),'tampered signed identity accepted');
      denied(() => auth.read(token,10000),'expiration boundary accepted');
      b = auth.read(auth.issue({tenant:'foundry-b',owner:'owner-b',expires:10000,csrf:'synthetic-csrf-b'}),0);
    },
    () => {
      assert.deepEqual(auth.mutate(token,0,config.origin,a.csrf),a);
      denied(() => auth.mutate(token,0,config.origin,'wrong'),'same-origin invalid CSRF accepted');
      denied(() => auth.mutate(token,0,'https://other.invalid',a.csrf),'cross-origin valid CSRF accepted');
    },
    () => {
      router = new Router(); events = new Events(); registry = new Registry(router,events,config.retryMs);
      low = registry.submit(a,'shared-key','inspect castings',1,0);
      assert.equal(registry.get(a,low.id).id,low.id);
      denied(() => registry.get(b,low.id),'foreign tenant job visible');
    },
    () => {
      assert.equal(registry.submit(a,'shared-key','inspect castings',1,0).id,low.id);
      denied(() => registry.submit(a,'shared-key','different payload',1,0),'conflicting replay accepted');
      denied(() => registry.submit(a,'shared-key','inspect castings',9,0),'conflicting priority accepted');
      foreign = registry.submit(b,'shared-key','foreign inspection',0,0);
      assert.notEqual(foreign.id,low.id,'idempotency key leaked between tenants');
      assert.equal(events.rows.length,2,'replays emitted duplicate submissions');
    },
    () => {
      high = registry.submit(a,'urgent','urgent calibration',9,0);
      peer = registry.submit(a,'peer','second calibration',9,0);
      assert.equal(registry.next(0)?.id,high.id,'priority with FIFO tie must select first calibration');
    },
    () => {
      const captured = {...high.route};
      router.active.model = 'assembly-large'; router.active.provider = 'synthetic-b'; router.active.revision++;
      assert.deepEqual(high.route,captured,'pending job route changed after operator update');
      assert.deepEqual(peer.route,captured);
    },
    () => {
      registry.start(high,0);
      assert.equal(high.actual?.provider,high.route.provider,'execution provider differs from pinned route');
      assert.equal(high.actual?.model,high.route.model,'execution model differs from pinned route');
      assert.equal(high.actual?.receipt,`${high.route.provider}/${high.route.model}@${high.route.revision}`);
    },
    () => {
      registry.cancel(high,1); assert.equal(high.status,'canceling','running job became terminal before worker acknowledgement');
      denied(() => registry.complete(high,1),'canceled worker published completion');
      registry.acknowledgeCancel(high,2); assert.equal(high.status,'canceled');
      const count = events.rows.length; registry.cancel(high,3); assert.equal(events.rows.length,count,'cancel replay emitted event');
      assert.equal(registry.next(3)?.id,peer.id);
    },
    () => {
      registry.start(peer,10); registry.fail(peer,10); assert.equal(peer.due,110);
      assert.notEqual(registry.next(109)?.id,peer.id,'retry dispatched before deadline');
      registry.start(peer,110); registry.fail(peer,110); assert.equal(peer.due,310,'second attempt must advance authoritative exponential deadline');
      assert.notEqual(registry.next(309)?.id,peer.id); registry.start(peer,310); registry.complete(peer,311);
      registry.start(low,312); registry.complete(low,313);
      registry.start(foreign,314); registry.complete(foreign,315);
    },
    () => {
      assert.deepEqual(events.rows.map(e => e.seq),events.rows.map((_,i) => i+1),'stream sequence is not global and gap-free');
      assert.equal(events.rows.filter(e => e.job === peer.id && e.type === 'started').length,3);
      assert.equal(events.rows.at(-1)?.type,'completed');
    },
    () => {
      const cursor = events.rows.find(e => e.job === peer.id && e.type === 'retry')!.seq;
      const expected = events.rows.filter(e => e.tenant === a.tenant && e.seq > cursor);
      assert.deepEqual(events.resume(a.tenant,cursor),expected,'resume repeated cursor or leaked foreign event');
      assert.deepEqual(events.resume(a.tenant,events.rows.length),[]);
      for (const invalid of [-1,0.5,events.rows.length+1]) denied(() => events.resume(a.tenant,invalid),'invalid cursor accepted');
    },
    () => {
      storage = new Storage();
      const artifact = storage.put(peer,'result','  calibrated ✓\n',320);
      assert.equal(artifact.sha256,hash(artifact.data),'artifact digest does not authenticate exact UTF-8 content');
      denied(() => storage.put(peer,'result','replacement',321),'immutable artifact overwritten');
      denied(() => storage.put(high,'result','canceled output',321),'canceled output published');
    },
    () => {
      storage.put(peer,'receipt',JSON.stringify(peer.actual),320);
      const manifest = storage.manifest(peer);
      assert.deepEqual(manifest.artifacts.map(a => a.kind),['receipt','result'],'manifest omitted worker receipt');
      assert.deepEqual(manifest.route,peer.route); assert.deepEqual(manifest.actual,peer.actual);
      assert.ok(manifest.artifacts.every(x => x.tenant === a.tenant && x.job === peer.id));
      storage.put(low,'result','old inspection',0); storage.put(low,'receipt',JSON.stringify(low.actual),0);
      storage.put(foreign,'result','foreign evidence',0); storage.put(foreign,'receipt',JSON.stringify(foreign.actual),0);
    },
    () => {
      const expected = storage.artifacts.filter(x => x.tenant === a.tenant).reduce((n,x) => n+Buffer.byteLength(x.data),0);
      assert.equal(storage.bytes(a.tenant),expected,'storage ledger differs from UTF-8 payload sizes');
      for (const x of storage.artifacts) assert.equal(x.bytes,Buffer.byteLength(x.data));
    },
    () => {
      // A disposable historical job is deliberately outside the retained release job set.
      const disposable = registry.submit(a,'historical','historical sweep',1,0);
      registry.start(disposable,400); registry.complete(disposable,401);
      storage.put(disposable,'result','expired scratch',0);
      const foreignBytes = storage.bytes(b.tenant);
      const removed = storage.cleanup(a.tenant,1000,config.retentionMs,[peer.id,low.id]);
      assert.deepEqual(removed,[`${disposable.id}/result`],'cleanup crossed tenant or retained evidence boundaries');
      assert.equal(storage.bytes(b.tenant),foreignBytes);
      assert.equal(storage.manifest(peer).artifacts.length,2); assert.equal(storage.manifest(low).artifacts.length,2);
      assert.deepEqual(storage.cleanup(a.tenant,1000,config.retentionMs,[peer.id,low.id]),[]);
      // Cleanup purges historical output, but its terminal job stays in the operator ledger.
    },
    () => {
      const actual = summary(registry,storage,a.tenant);
      assert.deepEqual(actual,{tenant:a.tenant,total:4,completed:3,canceled:1,active:0,bytes:storage.bytes(a.tenant),lastEvent:events.rows.at(-1)!.seq},'operator summary disagrees with tenant ledger');
      assert.equal(summary(registry,storage,b.tenant).total,1);
    },
    () => {
      bundle = release(registry,storage,a.tenant,gateHash);
      assert.equal(bundle.evidence.schema,1); assert.equal(bundle.evidence.gateHash,gateHash);
      assert.deepEqual(bundle.evidence.summary,summary(registry,storage,a.tenant));
      assert.equal(bundle.digest,hash(JSON.stringify(bundle.evidence)),'release digest does not bind summary, manifests, and events');
      assert.equal(bundle.evidence.manifests.length,3);
      for (const m of bundle.evidence.manifests) {
        assert.equal(m.tenant,a.tenant); assert.equal(m.actual?.provider,m.route.provider); assert.equal(m.actual?.model,m.route.model);
        for (const artifact of m.artifacts) {
          const original = storage.artifacts.find(x => x.job === m.job && x.kind === artifact.kind)!;
          assert.equal(artifact.sha256,hash(original.data)); assert.equal(artifact.bytes,Buffer.byteLength(original.data));
        }
      }
      assert.equal(bundle.evidence.manifests.flatMap(m => m.artifacts).reduce((n,x) => n+x.bytes,0),bundle.evidence.summary.bytes);
      assert.deepEqual(bundle.evidence.events,events.rows.filter(e => e.tenant === a.tenant));
      assert.ok(bundle.markdown.includes(bundle.digest) && bundle.markdown.includes('18/18') && bundle.markdown.includes(String(bundle.evidence.summary.bytes)),'human report not linked to evidence');
    }
  ];
  for (let i=0;i<gates.length;i++) {
    try { gates[i](); }
    catch (error) { emit(`GATE ${String(i+1).padStart(2,'0')}/18 FAIL ${names[i]}\n${(error as Error).message.split('\n')[0]}`); return {ok:false,gate:i+1}; }
    emit(`GATE ${String(i+1).padStart(2,'0')}/18 PASS ${names[i]}`);
  }
  return {ok:true,gate:18,bundle};
}
