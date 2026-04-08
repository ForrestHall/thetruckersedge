export type CostInputs = {
  fuelCostPerMile: number | null | undefined
  maintenanceCostPerMile: number | null | undefined
  insuranceMonthly: number | null | undefined
  otherMonthly: number | null | undefined
  avgMilesPerMonth: number | null | undefined
}

export function estimatedTotalCostPerMile(input: CostInputs): number | null {
  const fuel = Number(input.fuelCostPerMile) || 0
  const maint = Number(input.maintenanceCostPerMile) || 0
  const ins = Number(input.insuranceMonthly) || 0
  const other = Number(input.otherMonthly) || 0
  const miles = Number(input.avgMilesPerMonth) || 0
  if (fuel <= 0 && maint <= 0 && ins <= 0 && other <= 0) return null
  if (miles <= 0) {
    return fuel + maint > 0 ? fuel + maint : null
  }
  const fixedPerMile = (ins + other) / miles
  return fuel + maint + fixedPerMile
}
