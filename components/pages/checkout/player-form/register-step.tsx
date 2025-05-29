"use client";

import { useCreateEventContext } from "@/context/create-event";
import { Country } from "@/interface/auth";
import { Player } from "@/interface/tickets";
import { userService } from "@/service/user";
import { clearMask, formatCEP, formatCPF, formatPhone } from "@/utils/format";
import { isValidCPF } from "@/utils/validate";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const brazilSchema = z.object({
  name: z.string().min(3, "O nome deve ter, no mínimo, 3 caracteres."),
  document: z
    .string()
    .min(11, "O CPF deve conter 11 dígitos.")
    .refine((v) => isValidCPF(v.replace(/\D/g, "")), "CPF inválido."),
  email: z.string().email("E-mail inválido."),
  cep: z.string().length(8, "O CEP deve conter 8 dígitos."),
  phone: z
    .string()
    .min(10, "O telefone deve conter pelo menos 10 dígitos.")
    .max(13, "O telefone deve conter no máximo 13 dígitos."),
  sex: z.enum(["MALE", "FEMALE"]),
  bornAt: z.string().nonempty(),
});

const australiaSchema = z.object({
  name: z.string().min(3, "O nome deve ter, no mínimo, 3 caracteres."),
  email: z.string().email("E-mail inválido."),
  cep: z.string().length(4, "O Postcode deve conter 4 dígitos."),
  phone: z
    .string()
    .min(9, "O telefone deve conter pelo menos 9 dígitos.")
    .max(10, "O telefone deve conter no máximo 10 dígitos."),
  sex: z.enum(["MALE", "FEMALE"]),
  bornAt: z.string().nonempty(),
});

type BrazilForm = z.infer<typeof brazilSchema>;
type AustraliaForm = z.infer<typeof australiaSchema>;
type FormData = BrazilForm | AustraliaForm;

interface RegisterStepProps {
  email: string;
  onRegistered: (player: Player) => void;
  onClose: () => void;
}

export function RegisterStep({
  email,
  onRegistered,
  onClose,
}: RegisterStepProps) {
  const { event } = useCreateEventContext();
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    event?.country || Country.BRAZIL
  );

  const schema =
    selectedCountry === Country.BRAZIL ? brazilSchema : australiaSchema;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email,
      name: "",
      ...(selectedCountry === Country.BRAZIL ? { document: "" } : {}),
      cep: "",
      phone: "",
      sex: "MALE",
      bornAt: "",
    },
  });

  const { reset, setError } = form;

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        email: data.email.toLowerCase(),
        document:
          selectedCountry === Country.BRAZIL
            ? clearMask((data as BrazilForm).document)
            : undefined,
        cep: clearMask(data.cep),
        phone:
          (selectedCountry === Country.BRAZIL ? "55" : "61") +
          clearMask(data.phone),
        sex: data.sex,
        bornAt: new Date(data.bornAt).toISOString(),
        country: selectedCountry,
      };
      const newPlayer = await userService.registerWithoutPassword(payload);
      onRegistered(newPlayer);
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      if (msg?.includes("Email"))
        setError("email", { type: "manual", message: msg });
      if (msg?.includes("Phone"))
        setError("phone", { type: "manual", message: msg });
      if (msg?.includes("CPF"))
        setError("document", { type: "manual", message: msg });
    }
  };

  useEffect(() => {
    reset({
      email,
      name: "",
      ...(selectedCountry === Country.BRAZIL ? { document: "" } : {}),
      cep: "",
      phone: "",
      sex: "MALE",
      bornAt: "",
    });
  }, [selectedCountry, email, reset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Select
          onValueChange={(val) => setSelectedCountry(val as Country)}
          defaultValue={selectedCountry}
        >
          <FormItem>
            <FormLabel>País</FormLabel>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um país" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={Country.BRAZIL}>Brasil</SelectItem>
              <SelectItem value={Country.AUSTRALIA}>Austrália</SelectItem>
            </SelectContent>
            <FormMessage />
          </FormItem>
        </Select>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input readOnly {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCountry === Country.BRAZIL && (
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000.000.000-00"
                    value={formatCPF(field.value)}
                    onChange={(e) => field.onChange(clearMask(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {selectedCountry === Country.BRAZIL ? "CEP" : "Postcode"}
              </FormLabel>
              <FormControl>
                {selectedCountry === Country.BRAZIL ? (
                  <Input
                    maxLength={9}
                    placeholder="00000-000"
                    value={formatCEP(field.value || "")}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                ) : (
                  <Input
                    maxLength={4}
                    placeholder="Postcode"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <div className="flex">
                  <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0">
                    {selectedCountry === Country.BRAZIL ? "+55" : "+61"}
                  </div>
                  <Input
                    className="rounded-l-none"
                    placeholder={
                      selectedCountry === Country.BRAZIL
                        ? "(00) 00000-0000"
                        : "0412 345 678"
                    }
                    value={formatPhone(field.value || "", selectedCountry)}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bornAt"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value ? new Date(field.value) : undefined}
                  setDate={(date) => field.onChange(date?.toISOString())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}
