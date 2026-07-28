export function formatMoney(amount: number | null | undefined, currencyCode = "usd") {
  const safeAmount = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;

  return new Intl.NumberFormat("en", {
    currency: currencyCode.toUpperCase(),
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(safeAmount);
}
