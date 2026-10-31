// Content capacity and cost per content (HPP). A revision takes the slot of a new output, so the effective output is
// the theoretical output divided by (1 + revision rate).

export function effectiveOutput(theoreticalPerDay: number, firstPassRate: number): number {
  if (!(firstPassRate > 0 && firstPassRate <= 1)) throw new RangeError(`firstPassRate must be in (0, 1], got ${firstPassRate}`);
  if (!(theoreticalPerDay >= 0)) throw new RangeError(`theoreticalPerDay must be non-negative, got ${theoreticalPerDay}`);
  return theoreticalPerDay / (1 + (1 - firstPassRate));
}

export interface HppInput {
  teamMonthlyIdr: number;
  systemMonthlyIdr: number;
  theoreticalPerDay: number;
  firstPassRate: number;
  workDays: number;
}

export interface HppResult {
  monthlyTotal: number;
  outputPerMonth: number;
  hppPerContent: number;
}

export function hppPerContent(input: HppInput): HppResult {
  if (!(input.workDays > 0)) throw new RangeError('workDays must be positive');
  const monthlyTotal = input.teamMonthlyIdr + input.systemMonthlyIdr;
  const outputPerMonth = Math.round(effectiveOutput(input.theoreticalPerDay, input.firstPassRate) * input.workDays);
  const hpp = outputPerMonth > 0 ? Math.round(monthlyTotal / outputPerMonth) : 0;
  return { monthlyTotal, outputPerMonth, hppPerContent: hpp };
}
