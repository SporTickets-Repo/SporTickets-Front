import * as z from "zod";

const EventType = z
  .string()
  .nonempty({ message: "O tipo do evento é obrigatório" });

const eventFormValuesSchema = z.object({
  title: z.string().nonempty({ message: "O título é obrigatório" }),
  name: z.string().nonempty({ message: "O nome é obrigatório" }),
  slug: z.string().nonempty({ message: "O slug é obrigatório" }),
  type: z.string().nonempty({ message: "O tipo do evento é obrigatório" }),
  startDate: z.string().nonempty({ message: "A data de início é obrigatória" }),
  startTime: z.string().nonempty({ message: "A hora de início é obrigatória" }),
  endDate: z
    .string()
    .nonempty({ message: "A data de encerramento é obrigatória" }),
  endTime: z
    .string()
    .nonempty({ message: "A hora de encerramento é obrigatória" }),
  description: z.string().optional(),
  additionalInfo: z.string().optional(),
  cep: z.string().nonempty({ message: "O CEP é obrigatório" }),
  place: z.string().nonempty({ message: "O local é obrigatório" }),
  regulation: z.string().optional(),
  bannerImageFile: z.string().optional(),
  smallImageFile: z.string().optional(),
  paymentMethods: z.array(z.string()).optional(),
});

const userTypeEnum = z.enum(["ATHLETE", "VIEWER"]);

const categorySchema = z.object({
  title: z
    .string()
    .nonempty({ message: "O título da categoria é obrigatório" }),
  description: z.string().optional(),
  quantity: z.number().int().nonnegative({
    message: "A quantidade deve ser um número inteiro não negativo",
  }),
});

const personalizedFieldSchema = z.object({
  question: z
    .string()
    .nonempty({ message: "O título da requisição é obrigatório" }),
  type: z.string().nonempty({ message: "O tipo do campo é obrigatório" }),
  optionsList: z.array(z.string()).optional(),
});

const ticketLotSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "O nome do lote de ingressos é obrigatório" }),
  price: z.number().nonnegative({ message: "O preço deve ser não negativo" }),
  quantity: z.number().int().nonnegative({
    message: "A quantidade deve ser um número inteiro não negativo",
  }),
  startDate: z.string().nonempty({
    message: "A data de início do lote de ingressos é obrigatória",
  }),
  endDate: z.string().nonempty({
    message: "A data de término do lote de ingressos é obrigatória",
  }),
  isActive: z.boolean(),
});

const collaboratorSchema = z.object({
  userId: z.string().nonempty({ message: "O ID do usuário é obrigatório" }),
});

const ticketTypeSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "O nome do tipo de ingresso é obrigatório" }),
  description: z.string().optional(),
  restriction: z.string().optional(),
  userType: userTypeEnum,
  teamSize: z
    .number()
    .int()
    .min(1, { message: "O tamanho do time deve ser no mínimo 1" }),
  categories: z.any().optional(),
  personalizedFields: z.array(personalizedFieldSchema).optional(),
  ticketLots: z.array(ticketLotSchema).optional(),
});

const couponSchema = z.object({
  couponName: z.string().nonempty({ message: "O nome do cupom é obrigatório" }),
  percentage: z.number().min(0, {
    message: "O percentual deve ser não negativo",
  }),
  quantity: z.number().int().nonnegative({
    message: "A quantidade deve ser um número inteiro não negativo",
  }),
  isActive: z.boolean().optional(),
});

export const createEventFormValuesSchema = z.object({
  event: eventFormValuesSchema,
  ticketTypes: z.array(ticketTypeSchema),
  coupons: z.array(couponSchema).optional(),
  collaborators: z.array(collaboratorSchema).optional(),
});

export type CreateEventFormValues = z.infer<typeof createEventFormValuesSchema>;
export type EventFormValues = z.infer<typeof eventFormValuesSchema>;
