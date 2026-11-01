import { z } from "zod";

/**
 * Prototype-only switch (?demo=...) so reviewers can see every UI state
 * without a backend. Remove once real data is wired.
 */
export const demoModeSchema = z
  .enum(["normal", "empty", "error", "slow", "action-error"])
  .catch("normal");

export type DemoMode = z.infer<typeof demoModeSchema>;

export function parseDemoMode(value: string | string[] | undefined): DemoMode {
  return demoModeSchema.parse(Array.isArray(value) ? value[0] : value);
}
