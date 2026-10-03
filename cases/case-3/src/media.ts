import { DialogState, keyOf } from "./dialog.js";
import { codecPayloadType, decode } from "./codec.js";
import { MediaResult, Packet } from "./types.js";
export class MediaIngress {
  private seen = new Set<number>(); private highest = -1;
  constructor(private readonly state: DialogState) {}
  receive(packet: Packet): MediaResult { const d = this.state.dialog; if (!this.state.alive) return { accepted: false, reason: "dialog-not-alive" }; if (packet.ip !== "127.0.0.1") return { accepted: false, reason: "non-loopback-source" }; if (packet.port !== d.remotePort || packet.ssrc !== d.ssrc || packet.payloadType !== d.payloadType) return { accepted: false, reason: "binding-mismatch" }; if (packet.payloadType !== codecPayloadType(d.codec)) return { accepted: false, reason: "codec-payload-mismatch" }; if (this.seen.has(packet.sequence)) return { accepted: false, duplicate: true, reason: "duplicate" }; if (packet.sequence < this.highest - 10) return { accepted: false, reason: "stale-replay" }; this.seen.add(packet.sequence); this.highest = Math.max(this.highest, packet.sequence); return { accepted: true, reason: "accepted", frame: decode(packet, d.codec, keyOf(d)) }; }
}
