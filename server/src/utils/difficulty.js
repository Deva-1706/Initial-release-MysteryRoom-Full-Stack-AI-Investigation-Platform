export const DIFFICULTY_RULES = {
  Easy: { suspects: 3, clues: 5, hints: 2, basePoints: 100 },
  Medium: { suspects: 4, clues: 7, hints: 3, basePoints: 150 },
  Hard: { suspects: 5, clues: 9, hints: 3, basePoints: 200 },
};

export function calculateFinalScore({ correct, basePoints, discoveredCount, hintsUsed }) {
  if (!correct) return 0;
  return Math.max(0, basePoints + discoveredCount * 5 - hintsUsed * 10);
}
