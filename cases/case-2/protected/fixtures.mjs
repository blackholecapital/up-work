export const fixture = Object.freeze({
  boundary: { turnCount: 1, assistant: true, release: 'customer-visible', responseId: 'resp-synth-002', modelText: 'Prepared response' },
  questions: ['Which outcomes matter most?', 'What is your target launch date?'],
  destination: 'https://workroom.example.test/contracts/aurora-17',
  price: { amount: 4800, currency: 'USD', unit: 'fixed-price' },
  toolResult: { status: 'confirmed', actionId: 'act-aurora-17', kind: 'callback', subject: 'Ari Vale' },
  authority: { actionId: 'act-aurora-17', kind: 'callback', scope: 'customer-visible' },
  completedClaim: { status: 'completed' },
  responseText: 'Maya Chen will reply at ops@northstar.example.test.',
  callback: { kind: 'callback', label: 'Request a callback' },
  appointment: { kind: 'appointment', label: 'Book an appointment', appointmentTime: '2031-04-09T15:00:00Z' },
  brokenCandidate: { attempts: 0, destination: 'http://unsafe.example.test', price: { amount: 48, currency: 'EUR', unit: 'hourly' }, text: 'Contact maya.old@fictional.invalid', repaired: false }
});
