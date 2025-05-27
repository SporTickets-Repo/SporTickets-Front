import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { EventLevel, EventStatus, EventType } from "@/interface/event";
import { TransactionStatus } from "@/interface/transaction";

export const getTranslations = async (locale: Locale) => {
  const dictionary = await getDictionary(locale);

  return {
    eventStatusOrganizer: (status: EventStatus) =>
      dictionary.eventStatusOrganizer?.[status] ?? dictionary.desconhecido,

    eventStatus: (status: EventStatus) =>
      dictionary.eventStatus?.[status] ?? dictionary.desconhecido,

    eventType: (type: EventType) =>
      dictionary.eventTypes?.[type] ?? dictionary.desconhecido,

    eventLevel: (level: EventLevel) =>
      dictionary.eventLevels?.[level] ?? dictionary.desconhecido,

    sex: (sex: string) =>
      dictionary.sex?.[sex as keyof typeof dictionary.sex] ??
      dictionary.desconhecido,

    paymentStatus: (status: TransactionStatus) =>
      dictionary.paymentStatus?.[status] ?? dictionary.desconhecido,

    paymentMethod: (method: string) =>
      dictionary.paymentMethod?.[
        method as keyof typeof dictionary.paymentMethod
      ] ?? dictionary.desconhecido,
  };
};
