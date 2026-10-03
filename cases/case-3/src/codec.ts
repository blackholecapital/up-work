import { Codec, DecodedFrame, Packet } from "./types.js";
const ulaw = (u: number): number => { u = (~u) & 0xff; const sign = u & 0x80; const exponent = (u >> 4) & 7; const mantissa = u & 15; const value = ((mantissa << 3) + 0x84) << exponent; return sign ? 0x84 - value : value - 0x84; };
const alaw = (a: number): number => { a ^= 0x55; const t = (a & 15) << 4; const e = (a & 112) >> 4; return (e === 0 ? t + 8 : (t + 0x100) << (e - 1)) * ((a & 128) ? 1 : -1); };
export function decode(packet: Packet, codec: Codec, dialogKey: string): DecodedFrame { const pcm = new Int16Array(packet.payload.length); for (let i = 0; i < pcm.length; i++) pcm[i] = codec === "PCMU" ? ulaw(packet.payload[i]) : alaw(packet.payload[i]); return { pcm, provenance: { codec, sampleRate: 8000, channels: 1, dialogKey, sequence: packet.sequence } }; }
export function codecPayloadType(codec: Codec): number { return codec === "PCMU" ? 0 : 8; }
export function isMono8k(frame: DecodedFrame): boolean { return frame.provenance.sampleRate === 8000 && frame.provenance.channels === 1; }
