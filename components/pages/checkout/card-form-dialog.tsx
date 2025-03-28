import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  detectCardType,
  formatCardNumber,
  formatCVV,
  formatExpiryDate,
  isFutureExpiryDate,
  isValidCardNumber,
  isValidName,
} from "@/utils/creditCardValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const cardFormSchema = z.object({
  cardNumber: z
    .string()
    .min(19, { message: "O número do cartão deve estar completo." })
    .refine((val) => isValidCardNumber(val), {
      message: "Número de cartão inválido.",
    }),
  expiryDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, {
      message: "A data de expiração deve estar no formato MM/AA.",
    })
    .refine((val) => isFutureExpiryDate(val), {
      message: "O cartão está vencido.",
    }),
  cvv: z
    .string()
    .min(3, { message: "O CVV deve ter no mínimo 3 dígitos." })
    .max(4, { message: "O CVV deve ter no máximo 4 dígitos." }),
  cardholderName: z
    .string()
    .min(3, { message: "O nome no cartão deve ter no mínimo 3 caracteres." })
    .refine((val) => isValidName(val), {
      message: "O nome deve conter apenas letras e espaços.",
    }),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

interface CardFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CardFormValues) => void;
}

export function CardFormDialog({
  open,
  onClose,
  onSubmit,
}: CardFormDialogProps) {
  const [cardType, setCardType] = useState<string | null>(null);

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    },
  });

  const cardIconSrc = useMemo(() => {
    if (!cardType) return null;
    return `/assets/icons/${cardType}.svg`;
  }, [cardType]);

  function onFormSubmit(data: CardFormValues) {
    onSubmit(data);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="items-center mb-4">
          <DialogTitle>Método de pagamento</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-6">
          <img
            src="/assets/icons/mastercard.svg"
            alt="Mastercard"
            className="h-10"
          />
          <img src="/assets/icons/visa.svg" alt="Visa" className="h-10" />
          <img
            src="/assets/icons/amex.svg"
            alt="American Express"
            className="h-10"
          />
          <img src="/assets/icons/elo.svg" alt="Elo" className="h-10" />
          <img
            src="/assets/icons/hipercard.svg"
            alt="Hipercard"
            className="h-10"
          />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Número do Cartão"
                        value={field.value}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const formatted = formatCardNumber(raw).substring(
                            0,
                            19
                          );
                          const brand = detectCardType(formatted);
                          setCardType(brand);
                          field.onChange(formatted);
                        }}
                        className="bg-muted pr-12"
                      />
                      {cardIconSrc && (
                        <img
                          src={cardIconSrc}
                          alt={cardType ?? ""}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Data Expiração (MM/AA)"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(formatExpiryDate(e.target.value));
                        }}
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="CVV"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(formatCVV(e.target.value));
                        }}
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Nome no Cartão"
                      {...field}
                      className="bg-muted"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm text-muted-foreground">
              Ao clicar no botão "Salvar" abaixo, você concorda com os{" "}
              <a href="#" className="text-primary">
                Termos de Uso
              </a>{" "}
              e a{" "}
              <a href="#" className="text-primary">
                Declaração de Privacidade
              </a>
              , confirma ter mais de 18 anos e aceita que a Sport Tickets
              cobrará o preço da compra da sua forma de pagamento até você
              cancelar. Para cancelar, acesse o suporte.
            </div>

            <Button type="submit" className="w-full">
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
