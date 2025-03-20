"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useEvent } from "@/context/event";
import {
  PersonalizedFieldResponse,
  Player,
  TicketProps,
} from "@/interface/tickets";

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const emailFormSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const playerFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  document: z.string().min(11, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  cep: z.string().min(8, "CEP inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  sex: z.enum(["MALE", "FEMALE"]),
  bornAt: z.string(),
});

interface PlayerFormProps {
  open: boolean;
  onClose: () => void;
  currentTicket: TicketProps;
  player?: Player;
}

export function PlayerForm({
  open,
  onClose,
  currentTicket,
  player,
}: PlayerFormProps) {
  const { selectedTickets, setSelectedTickets } = useEvent();
  const hasPersonalizedFields =
    currentTicket?.ticketType?.personalizedFields?.length > 0;
  const [step, setStep] = useState<"search" | "register" | "fields">(
    player ? "fields" : "search"
  );
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState<Player | null>(player || null);

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "" },
  });

  const playerForm = useForm<z.infer<typeof playerFormSchema>>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      name: "",
      document: "",
      email: "",
      cep: "",
      phone: "",
      sex: "MALE",
      bornAt: "",
    },
  });

  useEffect(() => {
    if (!open) {
      setStep(player ? "fields" : "search");
      setPlayerData(player || null);
      emailForm.reset();
      playerForm.reset();
    }
  }, [open, player]);

  const handleEmailSubmit = async (data: z.infer<typeof emailFormSchema>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users?email=${data.email}`);
      const userData: Player = await response.json();

      if (userData) {
        setPlayerData(userData);
        updateTicketPlayers(userData);
        onClose();
      } else {
        playerForm.setValue("email", data.email);
        setStep("register");
      }
    } catch (error) {
      console.error("Erro ao buscar jogador:", error);
      setStep("register");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPlayer = async (
    data: z.infer<typeof playerFormSchema>
  ) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/register`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const newPlayer: Player = await response.json();
      setPlayerData(newPlayer);
      updateTicketPlayers(newPlayer);

      if (hasPersonalizedFields) {
        setStep("fields");
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Erro ao registrar jogador:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldsSubmit = (fields: PersonalizedFieldResponse[]) => {
    if (!playerData) return;
    updateTicketPlayers({ ...playerData, personalizedField: fields });
    onClose();
  };

  const updateTicketPlayers = (playerData: Player) => {
    setSelectedTickets((prevTickets) =>
      prevTickets?.map((t) =>
        t.id === currentTicket.id
          ? { ...t, players: [...t.players, playerData] }
          : t
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === "search" ? "Adicionar Jogador" : "Novo Jogador"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={step} className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="search">Buscar</TabsTrigger>
            {hasPersonalizedFields && (
              <TabsTrigger value="fields">Campos</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="search">
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Digite o e-mail"
                          {...field}
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
                  <Button type="submit" disabled={loading}>
                    {loading ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {step === "register" && (
            <TabsContent value="register">
              <Form {...playerForm}>
                <form
                  onSubmit={playerForm.handleSubmit(handleRegisterPlayer)}
                  className="space-y-4"
                >
                  <FormField
                    control={playerForm.control}
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
                    control={playerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={playerForm.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setStep("search")}>
                      Voltar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          )}

          {step === "fields" && (
            <TabsContent value="fields">
              {/* Implementação dos campos personalizados */}
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
