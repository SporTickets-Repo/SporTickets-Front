import { EventStatus, EventType } from "@/interface/event";

export const translateEventStatus = (status: EventStatus): string => {
  const translations: Record<EventStatus, string> = {
    [EventStatus.DRAFT]: "RASCUNHO",
    [EventStatus.REGISTRATION]: "ABERTO",
    [EventStatus.PROGRESS]: "EM ANDAMENTO",
    [EventStatus.CANCELLED]: "CANCELADO",
    [EventStatus.FINISHED]: "FINALIZADO",
  };

  return translations[status] || "Desconhecido";
};

export const translateEventType = (type: EventType): string => {
  const translations: Record<EventType, string> = {
    [EventType.FUTVOLEI]: "Futvôlei",
    [EventType.BEACH_TENIS]: "Beach Tênis",
    [EventType.ALTINHA]: "Altinha",
    [EventType.FUTEBOL]: "Futebol",
    [EventType.FUTEBOL_ARREIA]: "Futebol de Areia",
    [EventType.FUTSAL]: "Futsal",
    [EventType.VOLEI]: "Vôlei",
    [EventType.GERAL]: "Geral",
  };

  return translations[type] || "Desconhecido";
};
