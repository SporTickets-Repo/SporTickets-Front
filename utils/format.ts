import { Country } from "@/interface/auth";

export const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, "").replace(/\s/g, "");

export function formatCPF(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatCEP(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatPhone(
  value: string,
  country: Country = Country.BRAZIL
): string {
  let digits = value.replace(/\D/g, "");

  if (country === Country.AUSTRALIA) {
    if (digits.startsWith("0")) digits = digits.slice(1);
    digits = digits.slice(0, 9);

    if (digits.length <= 4) {
      return digits;
    }
    if (digits.length <= 7) {
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  const cleaned = digits.slice(0, 11);
  if (cleaned.length <= 10) {
    return cleaned
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{4})$/, "$1-$2");
  }
  return cleaned
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2");
}

export function clearMask(value: string) {
  return value.replace(/\D/g, "");
}
