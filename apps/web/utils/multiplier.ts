/**
 * Calculate the profit a user would make if they bet on the same outcome as the current pot
 *
 * @param pot The sum of the bets for the current day
 * @param other The other pot you want to compare with
 * @returns The multiplier for the pot
 */
export function calculateProfit(pot: number, other: number) {
  if (!other) {
    return 0;
  }

  return other / pot;
}
