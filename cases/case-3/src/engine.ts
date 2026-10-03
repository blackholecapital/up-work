import { answer, createDialog, socketLost, terminate, timeout } from "./dialog.js";
import { CapacityLedger } from "./capacity.js";
import { classify } from "./classifier.js";
import { MediaIngress } from "./media.js";
import { Packet, Classification } from "./types.js";
export class Case3Engine { readonly state = createDialog(); readonly media = new MediaIngress(this.state); readonly capacity = new CapacityLedger(1); private received: ReturnType<MediaIngress["receive"]>[] = []; start(): boolean { return this.capacity.admitSip() && this.capacity.attachMedia(); } ingest(packet: Packet): void { this.received.push(this.media.receive(packet)); } answer(): void { answer(this.state); } end(): void { terminate(this.state); this.capacity.releaseMedia(); this.capacity.releaseSip(); } timeout(): void { timeout(this.state); this.capacity.releaseMedia(); this.capacity.releaseSip(); } socketLost(): void { socketLost(this.state); this.capacity.releaseMedia(); this.capacity.releaseSip(); } classify(ms = 0): Classification { return classify(this.state, this.received, ms); } results() { return this.received; } }
