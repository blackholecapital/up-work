export function normalizeToolResult(result) {
  if (!result || result.status !== 'confirmed' || typeof result.actionId !== 'string') return null;
  return { status: 'confirmed', actionId: result.actionId, kind: result.kind, subject: result.subject };
}

export function validateCompletedClaim(claim, toolResult, authority) {
  const confirmed = normalizeToolResult(toolResult);
  return Boolean(
    claim?.status === 'completed' &&
    confirmed &&
    authority?.actionId === confirmed.actionId &&
    authority?.kind === confirmed.kind &&
    authority?.scope === 'customer-visible'
  );
}
