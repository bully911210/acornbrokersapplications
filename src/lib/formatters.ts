/**
 * Shared display formatters used across the application UI and PDF generation.
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

export const maskIdNumber = (id: string | undefined): string => {
  if (!id) return "";
  return id.substring(0, 6) + "*******";
};

export const maskAccountNumber = (account: string | undefined): string => {
  if (!account) return "";
  return "*".repeat(Math.max(0, account.length - 3)) + account.slice(-3);
};
