export function toPublicMystery(mystery) {
  const discovered = new Set(mystery.discoveredClueIds || []);
  return {
    id: String(mystery._id),
    title: mystery.title,
    premise: mystery.premise,
    difficulty: mystery.difficulty,
    basePoints: mystery.basePoints,
    suspects: (mystery.suspects || []).map(
      ({ id, name, role, age, description, motive }) => ({
        id, name, role, age, description, motive,
      })
    ),
    // Only IDs are sent for undiscovered clues. Their contents stay server-side.
    clues: (mystery.clues || []).map((clue) =>
      discovered.has(clue.id)
        ? { id: clue.id, title: clue.title, category: clue.category, description: clue.description }
        : { id: clue.id }
    ),
    hintsAvailable: (mystery.hints || []).length,
    discoveredClueIds: [...discovered],
    revealedHintIndexes: mystery.revealedHintIndexes || [],
    revealedHints: (mystery.revealedHintIndexes || []).map((index) => ({ index, text: mystery.hints?.[index] })).filter((hint) => typeof hint.text === "string"),
    status: mystery.status,
    createdAt: mystery.createdAt,
  };
}
