"use client";

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
import { Player } from "@/interface/tickets";
import { userService } from "@/service/user";
import { formatCEP, formatCPF, formatPhone } from "@/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  document: z.string().min(11),
  email: z.string().email(),
  cep: z.string().min(8),
  phone: z.string().min(10),
  sex: z.enum(["MALE", "FEMALE"]),
  bornAt: z.string(),
});

interface Props {
  onRegistered: (player: Player) => void;
  onClose: () => void;
  email: string;
}

export function RegisterStep({ email, onRegistered, onClose }: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      document: "",
      email,
      cep: "",
      phone: "",
      sex: "MALE",
      bornAt: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const response = await userService.registerWithoutPassword(data);
      onRegistered(response);
    } catch (error: any) {
      console.error("Failed to register:", error.response.data.message);
      if (error.response.data.message === "Email already exists") {
        form.setError("email", {
          type: "manual",
          message: "Esse e-mail já está cadastrado.",
        });
      }
      if (error.response.data.message === "Phone already exists") {
        form.setError("phone", {
          type: "manual",
          message: "Esse telefone já está cadastrado.",
        });
      }
      if (error.response.data.message === "CPF already exists") {
        form.setError("document", {
          type: "manual",
          message: "Esse CPF já está cadastrado.",
        });
      }
      if (error.response.data.message === "User already exists") {
        form.setError("email", {
          type: "manual",
          message: "Esse usuário já existe.",
        });
      }
      if (error.response.data.message === "Invalid CPF") {
        form.setError("document", {
          type: "manual",
          message: "Esse CPF é inválido.",
        });
      }
      if (error.response.data.message === "Invalid email") {
        form.setError("email", {
          type: "manual",
          message: "Esse e-mail é inválido.",
        });
      }
      if (error.response.data.message === "Invalid phone") {
        form.setError("phone", {
          type: "manual",
          message: "Esse telefone é inválido.",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
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

        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(formatCPF(e.target.value));
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
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input
                  placeholder="00000-000"
                  value={field.value}
                  onChange={(e) => field.onChange(formatCEP(e.target.value))}
                  className="bg-muted"
                />
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
                <Input
                  placeholder="(00) 00000-0000"
                  value={field.value}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                  className="bg-muted"
                />
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
