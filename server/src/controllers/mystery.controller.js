
import { z } from "zod";
import {
  createMystery as insertMystery,
  findMysteryById,
  saveMystery,
  isValidMysteryId,
  listMysteriesByUser,
  deleteMystery,
} from "../models/Mystery.js";

import { generateMysteryWithGemini } from "../services/gemini.service.js";
import {
  DIFFICULTY_RULES,
  calculateFinalScore,
} from "../utils/difficulty.js";

import { toPublicMystery } from "../utils/publicMystery.js";

const createSchema = z.object({
  premise: z.string()
    .trim()
    .min(20, "Please enter at least 20 characters for the mystery premise.")
    .max(2000),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

function validateId(id) {
  if (!isValidMysteryId(id)) {
    const error = new Error("Invalid mystery ID.");
    error.status = 400;
    throw error;
  }
}

function mapMystery(row) {
  if (!row) return null;

  return {
    _id: row.id,
    title: row.title,
    premise: row.premise,
    difficulty: row.difficulty,
    basePoints: row.base_points,
    suspects: row.suspects,
    clues: row.clues,
    hints: row.hints,
    solution: row.solution,
    discoveredClueIds: row.discovered_clue_ids || [],
    revealedHintIndexes: row.revealed_hint_indexes || [],
    status: row.status,
    accusation: row.accusation,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createMystery(req, res, next) {
  try {
    const input = createSchema.safeParse(req.body);

    if (!input.success) {
      return res.status(400).json({
        success: false,
        message: input.error.issues[0]?.message || "Invalid request body.",
      });
    }

    const generated = await generateMysteryWithGemini(input.data);
    const rules = DIFFICULTY_RULES[input.data.difficulty];

    const row = await insertMystery({
      title: generated.title,
      premise: generated.premise,
      difficulty: input.data.difficulty,
      basePoints: rules.basePoints,
      suspects: generated.suspects,
      clues: generated.clues,
      hints: generated.hints,
      solution: generated.solution,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      mystery: toPublicMystery(mapMystery(row)),
    });
  } catch (error) {
    next(error);
  }
}

export async function getMystery(req, res, next) {
  try {
    validateId(req.params.id);

    const row = await findMysteryById(req.params.id, req.user.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Mystery not found.",
      });
    }

    return res.json({
      success: true,
      mystery: toPublicMystery(mapMystery(row)),
    });
  } catch (error) {
    next(error);
  }
}

export async function discoverClue(req, res, next) {
  try {
    validateId(req.params.id);

    const row = await findMysteryById(req.params.id, req.user.id);
    const mystery = mapMystery(row);

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: "Mystery not found.",
      });
    }

    if (mystery.status !== "active") {
      return res.status(409).json({
        success: false,
        message: "This investigation is already completed.",
      });
    }

    const clueId = String(req.params.clueId);
    const clue = mystery.clues.find((item) => item.id === clueId);

    if (!clue) {
      return res.status(404).json({
        success: false,
        message: "Clue not found in this case.",
      });
    }

    if (!mystery.discoveredClueIds.includes(clueId)) {
      mystery.discoveredClueIds.push(clueId);

      await saveMystery(req.params.id, req.user.id, {
        discovered_clue_ids: mystery.discoveredClueIds,
      });
    }

    return res.json({
      success: true,
      clue: {
        id: clue.id,
        title: clue.title,
        category: clue.category,
        description: clue.description,
      },
      discoveredClueIds: mystery.discoveredClueIds,
      evidenceBonus: mystery.discoveredClueIds.length * 5,
    });
  } catch (error) {
    next(error);
  }
}

export async function revealHint(req, res, next) {
  try {
    validateId(req.params.id);

    const row = await findMysteryById(req.params.id, req.user.id);
    const mystery = mapMystery(row);

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: "Mystery not found.",
      });
    }

    if (mystery.status !== "active") {
      return res.status(409).json({
        success: false,
        message: "This investigation is already completed.",
      });
    }

    if (mystery.revealedHintIndexes.length >= mystery.hints.length) {
      return res.status(409).json({
        success: false,
        message: "No hints remain.",
      });
    }

    const hintIndex = mystery.revealedHintIndexes.length;
    mystery.revealedHintIndexes.push(hintIndex);

    await saveMystery(req.params.id, req.user.id, {
      revealed_hint_indexes: mystery.revealedHintIndexes,
    });

    return res.json({
      success: true,
      hint: {
        index: hintIndex,
        text: mystery.hints[hintIndex],
      },
      hintsRemaining:
        mystery.hints.length - mystery.revealedHintIndexes.length,
      hintPenalty: mystery.revealedHintIndexes.length * 10,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitAccusation(req, res, next) {
  try {
    validateId(req.params.id);

    const body = z.object({
      suspectId: z.number().int().positive(),
    }).safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        success: false,
        message: "A valid suspectId is required.",
      });
    }

    const row = await findMysteryById(req.params.id, req.user.id);
    const mystery = mapMystery(row);

    if (!mystery) {
      return res.status(404).json({
        success: false,
        message: "Mystery not found.",
      });
    }

    if (mystery.status === "completed") {
      return res.status(409).json({
        success: false,
        message: "An accusation has already been submitted for this case.",
      });
    }

    const suspect = mystery.suspects.find(
      (item) => item.id === body.data.suspectId
    );

    if (!suspect) {
      return res.status(400).json({
        success: false,
        message: "Selected suspect does not belong to this case.",
      });
    }

    const isCorrect =
      body.data.suspectId === mystery.solution.culpritSuspectId;

    const finalScore = calculateFinalScore({
      correct: isCorrect,
      basePoints: mystery.basePoints,
      discoveredCount: mystery.discoveredClueIds.length,
      hintsUsed: mystery.revealedHintIndexes.length,
    });

    const accusation = {
      suspectId: body.data.suspectId,
      isCorrect,
      finalScore,
      submittedAt: new Date().toISOString(),
    };

    await saveMystery(req.params.id, req.user.id, {
      status: "completed",
      accusation,
    });

    return res.json({
      success: true,
      result: {
        mysteryId: mystery._id,
        accusedSuspect: {
          id: suspect.id,
          name: suspect.name,
          role: suspect.role,
        },
        isCorrect,
        finalScore,
        basePoints: mystery.basePoints,
        cluesDiscovered: mystery.discoveredClueIds.length,
        clueBonus: mystery.discoveredClueIds.length * 5,
        hintsUsed: mystery.revealedHintIndexes.length,
        hintPenalty: mystery.revealedHintIndexes.length * 10,
        culprit: mystery.suspects.find(
          (item) => item.id === mystery.solution.culpritSuspectId
        ),
        explanation: mystery.solution.explanation,
        method: mystery.solution.method,
      },
    });
  } catch (error) {
    next(error);
  }
}


export async function listMyMysteries(req, res, next) {
  try {
    const rows = await listMysteriesByUser(req.user.id);
    return res.json({
      success: true,
      mysteries: rows.map((row) => ({
        id: row.id,
        title: row.title,
        premise: row.premise,
        difficulty: row.difficulty,
        basePoints: row.base_points,
        discoveredClueIds: row.discovered_clue_ids || [],
        revealedHintIndexes: row.revealed_hint_indexes || [],
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        finalScore: row.accusation?.finalScore ?? null,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function removeMystery(req, res, next) {
  try {
    validateId(req.params.id);
    const deleted = await deleteMystery(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Mystery not found." });
    }
    return res.json({ success: true, message: "Investigation deleted." });
  } catch (error) {
    next(error);
  }
}
