import { DialogState } from "./dialog.js";
import { Classification, MediaResult } from "./types.js";
export function classify(state: DialogState, media: MediaResult[], elapsedMs: number): Classification { if (!state.alive || elapsedMs >= 3000) return "no-media"; const accepted = media.filter(m => m.accepted); if (accepted.length === 0) return "no-media"; return state.phase === "post-answer" ? "confirmed-media" : "early-media"; }
export function failClosed(state: DialogState): Classification { return state.alive ? "no-media" : "rejected"; }
