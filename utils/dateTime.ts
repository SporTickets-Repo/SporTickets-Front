import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata uma data no padrão brasileiro (dd/MM/yyyy).
 * @param date - A data a ser formatada.
 * @returns A data formatada como string.
 */
export function formatDate(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "dd/MM/yyyy", { locale: ptBR });
}

/**
 * Formata uma data e hora no padrão brasileiro (dd/MM/yyyy HH:mm).
 * @param date - A data e hora a serem formatadas.
 * @returns A data e hora formatadas como string.
 */
export function formatDateTime(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

/**
 * Formata uma hora no padrão brasileiro (HH:mm).
 * @param date - A hora a ser formatada.
 * @returns A hora formatada como string.
 */
export function formatTime(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "HH:mm", { locale: ptBR });
}

/**
 * Formata uma hora no formato (01h, 16h).
 * @param date - A hora a ser formatada.
 * @returns A hora formatada como string.
 */
export function formatHour(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "HH'h'", { locale: ptBR });
}

/**
 * Formata uma data no padrão brasileiro sem o ano (dd/MM).
 * @param date - A data a ser formatada.
 * @returns A data formatada como string.
 */
export function formatDateWithoutYear(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "dd/MM", { locale: ptBR });
}
