export const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, "").replace(/\s/g, "");

export function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatCEP(value: string) {
  return value.replace(/\D/g, "").replace(/^(\d{5})(\d{1,3})/, "$1-$2");
}

export function formatPhone(value: string) {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 10) {
    return cleaned
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{4})$/, "$1-$2");
  }
  return cleaned
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2");
}
