/**
 * Get the number format for USD
 * @returns
 */
export function useCurrencyFormatter() {
  return Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
}
