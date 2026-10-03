export function validateDestination(destination, approvedUrl) {
  if (typeof destination !== 'string') return false;
  try {
    const url = new URL(destination);
    return url.href === approvedUrl && url.protocol === 'https:' && url.hostname === 'workroom.example.test';
  } catch {
    return false;
  }
}
