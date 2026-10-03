export function containsStaleContact(text, staleLiteral) {
  return String(text).toLowerCase().includes(staleLiteral.toLowerCase());
}

export function validateContact(text, currentContact, staleLiteral) {
  return !containsStaleContact(text, staleLiteral) && String(text).includes(currentContact);
}
