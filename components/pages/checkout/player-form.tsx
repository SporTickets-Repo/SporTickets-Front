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
import { DatePicker } from "@/components/ui/datePicker";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from "@/service/user";
import { PlayerCard } from "./player-card";

const emailFormSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const personalizedFieldsSchema = z.record(
  z.string().min(1, "Este campo é obrigatório")
);

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
  player: Player | null;
}

export function PlayerForm({
  open,
  onClose,
  currentTicket,
  player,
}: PlayerFormProps) {
  const { selectedTickets, setSelectedTickets } = useEvent();

  const [step, setStep] = useState<"search" | "register" | "fields">(
    player ? "fields" : "search"
  );
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState<Player | null>(player || null);

  const hasPersonalizedFields =
    currentTicket?.ticketType?.personalizedFields?.length > 0;

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

  const fieldsForm = useForm<Record<string, string>>({
    resolver: zodResolver(personalizedFieldsSchema),
    defaultValues: currentTicket.ticketType.personalizedFields.reduce(
      (acc, field) => ({ ...acc, [field.id]: "" }),
      {}
    ),
  });

  useEffect(() => {
    if (playerData?.personalizedField) {
      const newValues = playerData.personalizedField.reduce(
        (acc, field) => ({ ...acc, [field.personalizedFieldId]: field.answer }),
        {}
      );
      fieldsForm.reset(newValues);
    }
  }, [playerData]);

  const handleEmailSubmit = async (data: z.infer<typeof emailFormSchema>) => {
    setLoading(true);
    try {
      const response = await userService.getUserByEmail(data.email);
      setPlayerData(response);
      addPlayerToTicket(response);
      if (hasPersonalizedFields) {
        setStep("fields");
      } else {
        onClose();
      }
    } catch (error) {
      playerForm.setValue("email", data.email);
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
      const response = await userService.registerWithoutPassword({
        ...data,
        email: playerForm.getValues("email"),
        sex: "MALE",
      });
      setPlayerData(response);
      addPlayerToTicket(response);
      if (hasPersonalizedFields) {
        setStep("fields");
      } else {
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to register:", error.response.data.message);
      if (error.response.data.message === "CPF already exists") {
        playerForm.setError("document", {
          type: "manual",
          message: "CPF já cadastrado",
        });
      }
      if (error.response.data.message === "Email already exists") {
        playerForm.setError("email", {
          type: "manual",
          message: "E-mail já cadastrado",
        });
      }
      if (error.response.data.message === "Phone already exists") {
        playerForm.setError("phone", {
          type: "manual",
          message: "Telefone já cadastrado",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldsSubmit = (fieldsData: Record<string, string>) => {
    if (!playerData) return;

    const updatedPersonalizedFields: PersonalizedFieldResponse[] =
      Object.entries(fieldsData).map(([id, answer]) => ({
        personalizedFieldId: id,
        answer,
      }));

    const updatedPlayer: Player = {
      ...playerData,
      personalizedField: updatedPersonalizedFields,
    };

    updatePlayerInTicket(updatedPlayer);
    onClose();
  };

  const addPlayerToTicket = (newPlayer: Player) => {
    setSelectedTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === currentTicket.id
          ? {
              ...ticket,
              players: [...ticket.players, newPlayer],
            }
          : ticket
      )
    );
  };

  const updatePlayerInTicket = (updatedPlayer: Player) => {
    setSelectedTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === currentTicket.id
          ? {
              ...ticket,
              players: ticket.players.map((p) =>
                p.Userid === updatedPlayer.Userid ? updatedPlayer : p
              ),
            }
          : ticket
      )
    );
  };

  useEffect(() => {
    if (!open) {
      setStep(player ? "fields" : "search");
      setPlayerData(player || null);
      emailForm.reset();
      playerForm.reset();
    }
  }, [open, player]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="items-center mb-4">
          <DialogTitle>
            {step === "search" ? "Adicionar Jogador" : "Novo Jogador"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={step} className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="search">Buscar</TabsTrigger>
            {hasPersonalizedFields && (
              <TabsTrigger value="fields">Personalizados</TabsTrigger>
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
                  <FormField
                    control={playerForm.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={playerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={playerForm.control}
                    name="bornAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            setDate={(date) =>
                              field.onChange(date?.toISOString())
                            }
                          />
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

          {step === "fields" && playerData && (
            <TabsContent value="fields">
              <PlayerCard player={playerData} />
              <Form {...fieldsForm}>
                <form
                  onSubmit={fieldsForm.handleSubmit(handleFieldsSubmit)}
                  className="space-y-4 mt-4"
                >
                  {currentTicket.ticketType.personalizedFields.map((field) => (
                    <FormField
                      key={field.id}
                      control={fieldsForm.control}
                      name={field.id}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>{field.requestTitle}</FormLabel>
                          <FormControl>
                            {field.type === "text" ? (
                              <Input {...formField} />
                            ) : field.type === "select" ? (
                              <Select
                                onValueChange={formField.onChange}
                                defaultValue={formField.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(field.optionsList).map(
                                    ([key, value]) => (
                                      <SelectItem key={key} value={value}>
                                        {value}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            ) : null}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
