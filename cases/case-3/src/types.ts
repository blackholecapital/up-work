export type Codec = "PCMU" | "PCMA";
export type Phase = "early" | "post-answer" | "ended";
export type Classification = "confirmed-media" | "early-media" | "no-media" | "rejected";

export interface Dialog { callId: string; localTag: string; remoteTag: string; remoteIp: string; remotePort: number; ssrc: number; payloadType: number; codec: Codec; }
export interface Packet { ip: string; port: number; ssrc: number; payloadType: number; sequence: number; timestamp: number; payload: Uint8Array; }
export interface Provenance { codec: Codec; sampleRate: 8000; channels: 1; dialogKey: string; sequence: number; }
export interface DecodedFrame { pcm: Int16Array; provenance: Provenance; }
export interface MediaResult { accepted: boolean; reason: string; frame?: DecodedFrame; duplicate?: boolean; }
export interface Capacity { sip: number; media: number; }
