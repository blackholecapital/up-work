export function validateActionSemantics(action, callbackLabel, appointmentLabel) {
  return action?.kind === 'callback'
    ? action.label === callbackLabel && action.appointmentTime === undefined
    : action?.kind === 'appointment'
      ? action.label === appointmentLabel && typeof action.appointmentTime === 'string'
      : false;
}

export function buildResponse(candidate, policy) {
  return {
    text: candidate.text,
    destination: candidate.destination,
    price: candidate.price,
    questions: candidate.questions,
    action: candidate.action,
    claims: candidate.claims,
    fallback: candidate.fallback ?? policy.fallback
  };
}
