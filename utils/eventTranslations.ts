import { EventLevel, EventStatus, EventType } from "@/interface/event";
import { TransactionStatus } from "@/interface/transaction";

export const translateEventStatusOrganizer = (status: EventStatus): string => {
  const translations: Record<EventStatus, string> = {
    [EventStatus.DRAFT]: "RASCUNHO",
    [EventStatus.REGISTRATION]: "PUBLICADO",
    [EventStatus.PROGRESS]: "EM ANDAMENTO",
    [EventStatus.CANCELLED]: "CANCELADO",
    [EventStatus.FINISHED]: "FINALIZADO",
  };

  return translations[status] || "Desconhecido";
};

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
    [EventType.FUTVOLEI]: "Futevôlei",
    [EventType.BEACH_TENIS]: "Beach Tênis",
    [EventType.ALTINHA]: "Altinha",
    [EventType.FUTEBOL]: "Futebol",
    [EventType.FUTEBOL_ARREIA]: "Futebol de Areia",
    [EventType.FUTSAL]: "Futsal",
    [EventType.VOLEI]: "Vôlei",
    [EventType.GENERAL]: "Geral",
    [EventType.CORRIDA]: "Corrida",
  };

  return translations[type] || "Desconhecido";
};

export const translateEventLevel = (level: EventLevel): string => {
  const translations: Record<EventLevel, string> = {
    [EventLevel.BEGINNER]: "Iniciante",
    [EventLevel.AMATEUR]: "Amador",
    [EventLevel.SEMIPROFESSIONAL]: "Semiprofissional",
    [EventLevel.PROFESSIONAL]: "Profissional",
    [EventLevel.GENERAL]: "Geral",
  };

  return translations[level] || "Desconhecido";
};

export const translateSex = (sex: string): string => {
  const translations: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Feminino",
  };

  return translations[sex] || "Desconhecido";
};

export const translatePaymentStatus = (status: TransactionStatus): string => {
  const translations: Record<TransactionStatus, string> = {
    PENDING: "Pendente",
    APPROVED: "Aprovado",
    AUTHORIZED: "Autorizado",
    IN_PROCESS: "Em processo",
    IN_MEDIATION: "Em mediação",
    REJECTED: "Rejeitado",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
    CHARGED_BACK: "Estornado",
  };

  return translations[status] || "Desconhecido";
};
