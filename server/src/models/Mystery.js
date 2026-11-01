
import { supabase } from "../config/db.js";

function handleError(error) {
  if (error) {
    throw new Error(error.message || "Supabase database operation failed.");
  }
}

export async function createMystery(data) {
  const { data: mystery, error } = await supabase
    .from("mysteries")
    .insert({
      title: data.title,
      premise: data.premise,
      difficulty: data.difficulty,
      base_points: data.basePoints,
      suspects: data.suspects,
      clues: data.clues,
      hints: data.hints,
      solution: data.solution,
      user_id: data.userId,
    })
    .select("*")
    .single();

  handleError(error);
  return mystery;
}

export async function findMysteryById(id, userId) {
  const { data, error } = await supabase
    .from("mysteries")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  handleError(error);
  return data;
}

export async function saveMystery(id, userId, updates) {
  const { data, error } = await supabase
    .from("mysteries")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  handleError(error);
  return data;
}

export function isValidMysteryId(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}


export async function listMysteriesByUser(userId) {
  const { data, error } = await supabase
    .from("mysteries")
    .select("id,title,premise,difficulty,base_points,discovered_clue_ids,revealed_hint_indexes,status,created_at,updated_at,accusation")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  handleError(error);
  return data || [];
}

export async function deleteMystery(id, userId) {
  const { data, error } = await supabase
    .from("mysteries")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  handleError(error);
  return data;
}
