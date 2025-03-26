import { stripHtml } from "@/utils/format";
import * as z from "zod";

export const eventFormValuesSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
    slug: z
      .string()
      .min(3, { message: "O slug deve ter no mínimo 3 caracteres" })
      .regex(/^[a-z0-9-]+$/, {
        message:
          "O slug deve conter apenas letras minúsculas, números e hífens",
      })
      .nonempty({ message: "O slug é obrigatório" }),
    type: z.string().nonempty({ message: "O tipo do evento é obrigatório" }),
    level: z.string().nonempty({ message: "O nível do evento é obrigatório" }),
    startDate: z.preprocess((arg) => {
      if (arg instanceof Date) return arg.toISOString();
      return arg;
    }, z.string().nonempty({ message: "A data de início é obrigatória" })),

    endDate: z.preprocess((arg) => {
      if (arg instanceof Date) return arg.toISOString();
      return arg;
    }, z.string().nonempty({ message: "A data de encerramento é obrigatória" })),
    description: z.string().refine((val) => stripHtml(val).length >= 6, {
      message: "A descrição deve ter no mínimo 6 caracteres",
    }),
    regulation: z.string().refine((val) => stripHtml(val).length >= 6, {
      message: "O regulamento deve ter no mínimo 6 caracteres",
    }),
    additionalInfo: z.string().refine((val) => stripHtml(val).length >= 6, {
      message: "As informações adicionais devem ter no mínimo 6 caracteres",
    }),
    cep: z
      .string()
      .regex(/^\d{5}-\d{3}$/, {
        message: "O CEP deve estar no formato 12345-678",
      })
      .nonempty({ message: "O CEP é obrigatório" }),
    city: z.string().nonempty({ message: "A cidade é obrigatória" }),
    state: z.string().nonempty({ message: "O estado é obrigatório" }),
    street: z.string().nonempty({ message: "A rua é obrigatória" }),
    addressNumber: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().nonempty({ message: "O bairro é obrigatório" }),
    place: z.string().nonempty({ message: "O local é obrigatório" }),
    bannerImageFile: z
      .instanceof(File, {
        message: "O arquivo da imagem do banner é obrigatório",
      })
      .optional(),
    smallImageFile: z
      .instanceof(File, {
        message: "O arquivo da imagem pequena é obrigatório",
      })
      .optional(),
    paymentMethods: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start < end;
    },
    {
      message: "A data de encerramento deve ser posterior à data de início",
      path: ["endDate"],
    }
  );

const userTypeEnum = z.enum(["ATHLETE", "VIEWER"]);
const restrictionEnum = z.enum(["SAMECATEGORY", "NONE"]);

const categorySchema = z.object({
  title: z
    .string()
    .nonempty({ message: "O título da categoria é obrigatório" }),
  quantity: z.number().int().nonnegative({
    message: "A quantidade deve ser um número inteiro não negativo",
  }),
  restriction: restrictionEnum.optional(),
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
  quantity: z
    .number()
    .int()
    .min(1, { message: "A quantidade deve ser no mínimo 1" }),
  categories: z.array(categorySchema).optional(),
  personalizedFields: z.array(personalizedFieldSchema).optional(),
  ticketLots: z.array(ticketLotSchema).optional(),
});

const couponSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .nonempty({ message: "O nome do cupom é obrigatório" })
    .min(3, { message: "O nome do cupom deve ter no mínimo 3 caracteres" }),
  percentage: z
    .number()
    .min(1, {
      message: "O percentual de desconto deve ser no mínimo 1%",
    })
    .max(100, { message: "O percentual de desconto deve ser no máximo 100%" }),
  quantity: z
    .number()
    .int()
    .min(1, { message: "A quantidade deve ser no mínimo 1" }),
  isActive: z.boolean().optional(),
});

export const createEventFormValuesSchema = z.object({
  event: eventFormValuesSchema,
  ticketTypes: z.array(ticketTypeSchema),
  coupons: z.array(couponSchema),
  collaborators: z.array(collaboratorSchema).optional(),
});

export type CreateEventFormValues = z.infer<typeof createEventFormValuesSchema>;
export type EventFormValues = z.infer<typeof eventFormValuesSchema>;

export type InfoTabFormValues = z.infer<typeof eventFormValuesSchema>;
