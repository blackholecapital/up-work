export function normalizeQuestions(questions) {
  return questions.map((question) => String(question).trim()).filter(Boolean);
}

export function validateQuestions(questions, maxQuestions) {
  const normalized = normalizeQuestions(questions);
  const lower = normalized.map((question) => question.toLowerCase());
  return normalized.length <= maxQuestions && new Set(lower).size === lower.length;
}
