import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface Coupon {
  couponName: string;
  percentage: number;
  quantity: number;
  isActive?: boolean;
}

interface FormValues {
  coupons: Coupon[];
}

export function CouponsTab() {
  const { control } = useFormContext<FormValues>();

  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: "coupons",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h2 className="text-lg font-semibold">Cupons</h2>
          <p className="text-sm text-muted-foreground">
            Quantidade total: {fields.length}
          </p>
        </div>
        <Button
          size="sm"
          type="button"
          onClick={() =>
            append({
              couponName: "",
              percentage: 0,
              quantity: 0,
              isActive: false,
            })
          }
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Cupom
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-4 p-4">
        {fields.map((item, index) => (
          <AccordionItem
            key={item.id}
            value={`coupon-${index}`}
            className="border rounded-md"
          >
            <AccordionTrigger className="flex items-center justify-between">
              <div className="flex items-center justify-between w-full px-2">
                <div>
                  <h3 className="font-medium">
                    {item.couponName || `Cupom ${index + 1}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.percentage}% • Quantidade: {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2">
                  <FormField
                    control={control}
                    name={`coupons.${index}.isActive`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            onClick={(e) => e.stopPropagation()}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label>Ativo</Label>
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(index);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 sm:p-6 space-y-4 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`coupons.${index}.couponName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do cupom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do cupom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                  <FormField
                    control={control}
                    name={`coupons.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Percentual de Desconto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = Math.min(
                                100,
                                Number(e.target.value.replace(/\D/g, ""))
                              );
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`coupons.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Quantidade"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              field.onChange(Number(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
