import { Dialog, Phase } from "./types.js";
export interface DialogState { dialog: Dialog; phase: Phase; alive: boolean; }
export const keyOf = (d: Dialog): string => `${d.callId}|${d.localTag}|${d.remoteTag}`;
export function createDialog(): DialogState { return { dialog: { callId: "case3-call", localTag: "local-a", remoteTag: "remote-b", remoteIp: "127.0.0.1", remotePort: 42000, ssrc: 0x2345abcd, payloadType: 0, codec: "PCMU" }, phase: "early", alive: true }; }
export function answer(s: DialogState): void { if (s.alive && s.phase === "early") s.phase = "post-answer"; }
export function terminate(s: DialogState): void { s.alive = false; s.phase = "ended"; }
export function timeout(s: DialogState): void { terminate(s); }
export function socketLost(s: DialogState): void { terminate(s); }
