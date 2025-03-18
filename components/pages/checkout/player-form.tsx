"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Player } from "@/interface/tickets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const emailFormSchema = z.object({
  email: z.string().email("Email inválido"),
});

const playerFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  instagram: z.string().optional(),
  shirtSize: z.string(),
  category: z.string(),
  gender: z.string(),
});

interface PlayerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Player) => void;
  initialData?: Player;
}

export function PlayerForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: PlayerFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: initialData?.email || "",
    },
  });

  const playerForm = useForm<z.infer<typeof playerFormSchema>>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      cpf: "",
      instagram: "",
      shirtSize: "",
      category: "",
      gender: "",
    },
  });

  const handleEmailSubmit = async (data: z.infer<typeof emailFormSchema>) => {
    setLoading(true);
    try {
      // Here you would fetch user data from your API
      const response = await fetch(`/api/users?email=${data.email}`);
      const userData = await response.json();

      if (userData) {
        onSubmit(userData);
        onClose();
      } else {
        playerForm.setValue("email", data.email);
        setStep(2);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPlayer = async (
    data: z.infer<typeof playerFormSchema>
  ) => {
    setLoading(true);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Buscar Jogador" : "Novo Jogador"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
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
                        placeholder="Digite seu email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
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
                    <FormLabel>Nome Completo</FormLabel>
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
                      <Input type="email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="cpf"
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={playerForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="amateur">Amador</SelectItem>
                          <SelectItem value="professional">
                            Profissional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={playerForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={playerForm.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="shirtSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho Camisa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["PP", "P", "M", "G", "GG", "XGG"].map((size) => (
                          <SelectItem key={size} value={size.toLowerCase()}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
