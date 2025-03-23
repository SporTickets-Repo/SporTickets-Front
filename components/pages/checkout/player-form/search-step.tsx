"use client";

import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const emailFormSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

interface Props {
  onFound: (player: Player) => void;
  onNotFound: (email: string) => void;
  onClose: () => void;
  initialEmail?: string;
}

export function SearchStep({
  onFound,
  onNotFound,
  onClose,
  initialEmail = "",
}: Props) {
  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: initialEmail },
  });

  const handleSubmit = async (data: z.infer<typeof emailFormSchema>) => {
    try {
      const response = await userService.getUserByEmail(data.email);
      onFound(response);
    } catch {
      onNotFound(data.email);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o e-mail" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Buscar</Button>
        </div>
      </form>
    </Form>
  );
}
