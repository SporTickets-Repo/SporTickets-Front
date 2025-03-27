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
import { useAuth } from "@/context/auth";
import { Player, TicketResponse } from "@/interface/tickets";
import { userService } from "@/service/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
  currentTicket: TicketResponse;
}

export function SearchStep({
  onFound,
  onNotFound,
  onClose,
  initialEmail = "",
  currentTicket,
}: Props) {
  const { user } = useAuth();
  const [customError, setCustomError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: initialEmail },
  });

  const handleSubmit = async (data: z.infer<typeof emailFormSchema>) => {
    handleFound(data.email);
  };

  const handleAddMe = () => {
    if (!user) return;
    handleFound(user.email);
  };

  const handleFound = async (email: string) => {
    try {
      const response = await userService.getUserByEmail(email);
      const isDuplicated = currentTicket.players.some(
        (p) => p.userId === response.userId
      );
      if (isDuplicated) {
        setCustomError("Já existe um jogador com este CPF neste ingresso.");
        return;
      }
      onFound(response);
    } catch {
      onNotFound(email);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Button onClick={handleAddMe} className="w-full">
          Adicionar meu usuário
        </Button>
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
              {customError && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {customError}
                </p>
              )}
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
