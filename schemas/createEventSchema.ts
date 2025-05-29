import { Country } from "@/interface/auth";
import { Currency } from "@/interface/event";
import { formatCEP, stripHtml } from "@/utils/format";
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

    description: z.preprocess(
      (val) =>
        typeof val === "string" && stripHtml(val).trim() === ""
          ? undefined
          : val,
      z
        .string()
        .optional()
        .refine((val) => !val || stripHtml(val).length >= 6, {
          message: "A descrição deve ter no mínimo 6 caracteres",
        })
    ),

    regulation: z.preprocess(
      (val) =>
        typeof val === "string" && stripHtml(val).trim() === ""
          ? undefined
          : val,
      z
        .string()
        .optional()
        .refine((val) => !val || stripHtml(val).length >= 6, {
          message: "O regulamento deve ter no mínimo 6 caracteres",
        })
    ),

    additionalInfo: z.preprocess(
      (val) =>
        typeof val === "string" && stripHtml(val).trim() === ""
          ? undefined
          : val,
      z
        .string()
        .optional()
        .refine((val) => !val || stripHtml(val).length >= 6, {
          message: "As informações adicionais devem ter no mínimo 6 caracteres",
        })
    ),
    emailCustomText: z.preprocess(
      (val) =>
        typeof val === "string" && stripHtml(val).trim() === ""
          ? undefined
          : val,
      z
        .string()
        .optional()
        .refine((val) => !val || stripHtml(val).length >= 6, {
          message:
            "As informações de email customizado devem ter no mínimo 6 caracteres",
        })
    ),

    cep: z
      .string()
      .transform((val) => val.replace(/\D/g, "").slice(0, 8))
      .refine((val) => /^\d{8}$/.test(val), {
        message: "O CEP deve conter 8 dígitos numéricos",
      })
      .transform(formatCEP),
    city: z.string().nonempty({ message: "A cidade é obrigatória" }),
    state: z.string().nonempty({ message: "O estado é obrigatório" }),
    street: z.string().nonempty({ message: "A rua é obrigatória" }),
    addressNumber: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().nonempty({ message: "O bairro é obrigatório" }),
    place: z.string().nonempty({ message: "O local é obrigatório" }),
    allowIndividualTickets: z.boolean().optional(),
    country: z.nativeEnum(Country, {
      errorMap: () => ({
        message: "País é obrigatório e deve ser um valor válido.",
      }),
    }),
    currency: z.nativeEnum(Currency, {
      errorMap: () => ({
        message: "Moeda é obrigatória e deve ser um valor válido.",
      }),
    }),
    eventFee: z
      .number({
        required_error: "Taxa do evento é obrigatória.",
        invalid_type_error: "Taxa deve ser um número.",
      })
      .min(0, { message: "Taxa mínima é 0." })
      .max(100, { message: "Taxa máxima é 100." }),
    allowFullTickets: z.boolean().optional(),
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
const restrictionEnum = z.enum(["SAME_CATEGORY", "NONE"]);

const categorySchema = z.object({
  title: z
    .string()
    .nonempty({ message: "O título da categoria é obrigatório" }),
  quantity: z.number().int().min(1, {
    message: "Mínimo 1",
  }),
  restriction: restrictionEnum.optional(),
});

const personalizedFieldSchema = z.object({
  requestTitle: z
    .string()
    .min(3, { message: "A pergunta deve ter no mínimo 3 caracteres" }),
  type: z.string().nonempty({ message: "O tipo do campo é obrigatório" }),
  optionsList: z.array(z.string()).optional(),
});

const ticketLotSchema = z
  .object({
    name: z
      .string()
      .nonempty({ message: "O nome do lote de ingressos é obrigatório" }),
    price: z.number().nonnegative({ message: "O preço deve ser não negativo" }),
    quantity: z.number().int().nonnegative({
      message: "A quantidade deve ser um número inteiro não negativo",
    }),
    startDate: z.preprocess(
      (arg) => {
        if (arg instanceof Date) return arg.toISOString();
        return arg;
      },
      z.string().nonempty({
        message: "A data de início do lote de ingressos é obrigatória",
      })
    ),
    endDate: z.preprocess(
      (arg) => {
        if (arg instanceof Date) return arg.toISOString();
        return arg;
      },
      z.string().nonempty({
        message: "A data de término do lote de ingressos é obrigatória",
      })
    ),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start < end;
    },
    {
      message: "A data de término deve ser posterior à data de início",
      path: ["endDate"],
    }
  );

const ticketTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, {
    message: "O nome do tipo de ingresso deve ter no mínimo 3 caracteres",
  }),
  description: z.string().optional(),
  restriction: z.string().optional(),
  userType: userTypeEnum,
  teamSize: z
    .number()
    .int()
    .min(1, { message: "O tamanho do time deve ser no mínimo 1" }),
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

const bracketSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .nonempty({ message: "O nome da chave é obrigatório" })
    .min(3, { message: "O nome da chave deve ter no mínimo 3 caracteres" }),
  url: z.string().nonempty({ message: "A URL da chave é obrigatória" }),
  isActive: z.boolean().optional(),
});

const rankingSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .nonempty({ message: "O nome do ranking é obrigatório" })
    .min(3, { message: "O nome do ranking deve ter no mínimo 3 caracteres" }),
  url: z.string().nonempty({ message: "A URL do ranking é obrigatória" }),
  isActive: z.boolean().optional(),
});

const termSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .nonempty({ message: "O título do termo é obrigatório" })
    .min(3, { message: "O título do termo deve ter no mínimo 3 caracteres" }),
  isObligatory: z.boolean().optional(),
  fileUrl: z.string().optional(),
  file: z
    .instanceof(File, {
      message: "O arquivo do termo é obrigatório",
    })
    .optional(),
});

export const createEventFormValuesSchema = z.object({
  event: eventFormValuesSchema,
  ticketTypes: z.array(ticketTypeSchema),
  coupons: z.array(couponSchema),
  bracket: z.array(bracketSchema),
  ranking: z.array(rankingSchema),
  terms: z.array(termSchema),
});

export type CreateEventFormValues = z.infer<typeof createEventFormValuesSchema>;
