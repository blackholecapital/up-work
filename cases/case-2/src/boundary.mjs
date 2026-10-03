// Intentionally broken baseline: it releases a model turn without the customer boundary.
export function makeBoundary(input) {
  return { ...input, release: 'customer-visible', turnCount: 1, assistant: true };
}

export function isDeterministicRelease(boundary) {
  return boundary.turnCount === 1 && boundary.assistant === true && boundary.release === 'customer-visible';
}
