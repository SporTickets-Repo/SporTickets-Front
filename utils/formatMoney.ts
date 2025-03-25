export const formatMoneyBR = (
  value: number | null | undefined | string
): string => {
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  if (!value) return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
