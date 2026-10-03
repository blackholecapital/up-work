import { POLICY, SYNTHETIC } from '../src/config.mjs';
import { makeBoundary, isDeterministicRelease } from '../src/boundary.mjs';
import { validateQuestions } from '../src/questions.mjs';
import { validateDestination } from '../src/destination.mjs';
import { normalizePrice, validatePrice } from '../src/pricing.mjs';
import { normalizeToolResult, validateCompletedClaim } from '../src/claims.mjs';
import { containsStaleContact, validateContact } from '../src/contacts.mjs';
import { repairOnce, deterministicFallback } from '../src/repair.mjs';
import { validateActionSemantics, buildResponse } from '../src/semantics.mjs';
import { fixture } from './fixtures.mjs';

export const gateDefinitions = [
  ['G01', 'deterministic one-turn release boundary', () => isDeterministicRelease(makeBoundary(fixture.boundary))],
  ['G02', 'question count is within policy', () => validateQuestions(fixture.questions, POLICY.maxQuestions)],
  ['G03', 'questions are unique after normalization', () => validateQuestions([...fixture.questions, '  '], POLICY.maxQuestions)],
  ['G04', 'destination is exact approved URL', () => validateDestination(fixture.destination, POLICY.approvedUrl)],
  ['G05', 'destination is HTTPS on approved host', () => new URL(fixture.destination).protocol === 'https:' && new URL(fixture.destination).hostname === 'workroom.example.test'],
  ['G06', 'price has structured USD shape', () => normalizePrice(fixture.price)?.currency === 'USD'],
  ['G07', 'price amount and unit match approval', () => validatePrice(fixture.price, POLICY.usdAmount)],
  ['G08', 'completed claim follows normalized confirmed tool result', () => validateCompletedClaim(fixture.completedClaim, fixture.toolResult, fixture.authority)],
  ['G09', 'action authority matches confirmed action', () => fixture.authority.actionId === normalizeToolResult(fixture.toolResult).actionId],
  ['G10', 'stale contact literal is detectable', () => containsStaleContact(`x ${SYNTHETIC.staleContact}`, SYNTHETIC.staleContact)],
  ['G11', 'released text contains only current contact', () => validateContact(fixture.responseText, POLICY.contact, SYNTHETIC.staleContact)],
  ['G12', 'repair is bounded to one attempt', () => repairOnce(fixture.brokenCandidate, POLICY, POLICY.contact, SYNTHETIC.staleContact).attempts === 1],
  ['G13', 'second repair attempt deterministically falls back', () => deterministicFallback({ ...fixture.brokenCandidate, attempts: 1 }, POLICY).fallback === POLICY.fallback],
  ['G14', 'callback has no appointment time', () => validateActionSemantics(fixture.callback, 'Request a callback', 'Book an appointment')],
  ['G15', 'appointment retains appointment time', () => validateActionSemantics(fixture.appointment, 'Request a callback', 'Book an appointment')],
  ['G16', 'response assembly preserves bounded fields', () => Object.keys(buildResponse({ ...fixture.brokenCandidate, repaired: true }, POLICY)).length === 7],
  ['G17', 'fixture is synthetic and offline', () => !JSON.stringify(fixture).match(/(password|token|api[_-]?key|@gmail|@yahoo)/i)],
  ['G18', 'policy fallback is stable', () => POLICY.fallback === 'I can continue once the approved workroom and confirmed action details are available.']
];

export function runGates() {
  const results = [];
  for (const [id, name, check] of gateDefinitions) {
    try {
      const passed = Boolean(check());
      results.push({ id, name, passed, error: passed ? null : 'assertion returned false' });
      if (!passed) break;
    } catch (error) {
      results.push({ id, name, passed: false, error: error.message });
      break;
    }
  }
  return results;
}
