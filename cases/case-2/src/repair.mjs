export function repairOnce(candidate, policy, currentContact, staleContact) {
  if (candidate.attempts !== 0) return { ...candidate, fallback: policy.fallback, repaired: false, attempts: candidate.attempts };
  const repaired = {
    ...candidate,
    attempts: 1,
    destination: policy.approvedUrl,
    price: { amount: policy.usdAmount, currency: 'USD', unit: 'fixed-price' },
    text: String(candidate.text).replaceAll(staleContact, currentContact),
    repaired: true
  };
  return repaired;
}

export function deterministicFallback(candidate, policy) {
  return candidate.repaired ? candidate : { ...candidate, fallback: policy.fallback };
}
