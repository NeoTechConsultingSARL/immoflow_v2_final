export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatPercentage = (value: number): string => `${value.toFixed(2)}%`;

export const calculateAmountFromDimensions = (
  landSize: string | number | null | undefined,
  unitPrice: string | number | null | undefined,
): number | null => {
  const size = landSize === "" || landSize === null || landSize === undefined ? null : Number(landSize);
  const price = unitPrice === "" || unitPrice === null || unitPrice === undefined ? null : Number(unitPrice);

  if (size === null || price === null || Number.isNaN(size) || Number.isNaN(price)) {
    return null;
  }

  return Math.round(size * price * 100) / 100;
};
