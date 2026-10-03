export const ACTIONS = Object.freeze({ callback: 'callback', appointment: 'appointment' });

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
