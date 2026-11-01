import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  createMystery,
  getMystery,
  discoverClue,
  revealHint,
  submitAccusation,
  listMyMysteries,
  removeMystery,
} from "../controllers/mystery.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", listMyMysteries);
router.delete("/:id", removeMystery);
router.post("/", createMystery);
router.get("/:id", getMystery);
router.post("/:id/clues/:clueId/discover", discoverClue);
router.post("/:id/hints/reveal", revealHint);
router.post("/:id/accuse", submitAccusation);

export default router;
