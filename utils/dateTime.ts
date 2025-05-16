import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function formatTime(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "HH:mm", { locale: ptBR });
}

export function formatHour(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "HH'h'", { locale: ptBR });
}

export function formatDateWithoutYear(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "dd/MM", { locale: ptBR });
}
