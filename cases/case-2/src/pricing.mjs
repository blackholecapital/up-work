export function normalizePrice(claim) {
  if (!claim || claim.currency !== 'USD') return null;
  const amount = Number(claim.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return { amount, currency: 'USD', unit: claim.unit };
}

export function validatePrice(claim, expectedAmount) {
  const normalized = normalizePrice(claim);
  return normalized !== null && normalized.amount === expectedAmount && normalized.unit === 'fixed-price';
}
