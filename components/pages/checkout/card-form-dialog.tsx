import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const cardFormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: "O número do cartão deve ter no mínimo 16 dígitos." })
    .max(19, { message: "O número do cartão deve ter no máximo 19 dígitos." }),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, {
    message: "A data de expiração deve estar no formato MM/AA.",
  }),
  cvv: z.string().length(3, {
    message: "O CVV deve ter exatamente 3 dígitos.",
  }),
  cardholderName: z.string().min(3, {
    message: "O nome no cartão deve ter no mínimo 3 caracteres.",
  }),
  paymentType: z.enum(["credit", "debit"], {
    message: "Selecione uma forma de pagamento válida.",
  }),
  allowDebitFallback: z.boolean().optional(),
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
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      paymentType: "credit",
      allowDebitFallback: false,
    },
  });

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
                    <Input
                      placeholder="Número do Cartão"
                      {...field}
                      className="bg-muted"
                    />
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
                        placeholder="Data Expiração"
                        {...field}
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
                        {...field}
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

            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Forma de pagamento preferida
              </Label>
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 border rounded-md p-4">
                          <RadioGroupItem value="credit" id="credit" />
                          <Label htmlFor="credit">Crédito</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-4">
                          <RadioGroupItem value="debit" id="debit" />
                          <Label htmlFor="debit">Débito</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="allowDebitFallback"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label>
                      Se a cobrança no crédito falhar, você nos autoriza a
                      tentar no débito (caso seu cartão tenha esta opção).
                    </Label>
                  </div>
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
