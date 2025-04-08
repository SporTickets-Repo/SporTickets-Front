"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreateEventContext } from "@/context/create-event";
import { Collaborator, EventDashboardAccess } from "@/interface/collaborator";
import { dashboardService } from "@/service/dashboard";
import { userService } from "@/service/user";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";

const collaboratorSchema = z.object({
  identifier: z
    .string()
    .nonempty({ message: "CPF ou Email é obrigatório" })
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^\d{3}\d{3}\d{3}\d{2}$/.test(value),
      { message: "CPF ou Email inválido" }
    ),
});

export function CollaboratorsTab() {
  const { eventId, event } = useCreateEventContext();

  const [collaborators, setCollaborators] = useState<EventDashboardAccess[]>(
    event?.eventDashboardAccess || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [foundCollaborator, setFoundCollaborator] =
    useState<Collaborator | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof collaboratorSchema>>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: { identifier: "" },
  });
  const { control, handleSubmit, setError, reset } = form;

  const onSearchSubmit = async (data: z.infer<typeof collaboratorSchema>) => {
    try {
      const { identifier } = data;
      const res = await userService.getCollaborators(identifier);

      if (res.exist) {
        setFoundCollaborator(res.user);
      } else {
        setError("identifier", {
          type: "manual",
          message: "Usuário não encontrado ou não existe.",
        });
        toast.error("Nenhum usuário encontrado.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setError("identifier", {
            type: "manual",
            message: "Você já é um colaborador deste evento.",
          });
          toast.error("Você já é um colaborador deste evento.");
        } else {
          setError("identifier", {
            type: "manual",
            message: "Ocorreu um erro ao buscar o usuário.",
          });
          toast.error("Erro ao buscar o usuário.");
        }
      } else {
        toast.error("Erro desconhecido.");
      }
    }
  };

  const handleConfirmCollaborator = () => {
    if (foundCollaborator) {
      if (eventId) {
        setCollaborators((prev) => [
          ...prev,
          {
            id: foundCollaborator.id,
            name: foundCollaborator.name,
            email: foundCollaborator.email,
            userId: foundCollaborator.id,
            eventId: eventId,
            user: foundCollaborator,
          },
        ]);
      }
      setFoundCollaborator(null);
      setDialogOpen(false);
      reset();
    }
  };

  const handleBackToSearch = () => {
    setFoundCollaborator(null);
  };

  const handleSave = async () => {
    if (!eventId) {
      toast.error("Event ID is missing.");
      return;
    }

    setIsSaving(true);
    try {
      await dashboardService.assignList({
        userIds: collaborators.map((c) => c.userId),
        eventId,
      });
      toast.success("Colaboradores atualizados com sucesso!");
      await mutate(`/events/${eventId}`);
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("Você não pode se adicionar como colaborador.");
      } else {
        toast.error("Falha ao salvar as alterações.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Colaboradores</h2>
          <p className="text-sm text-muted-foreground">
            Quando você convida colaboradores para o seu evento, eles podem
            administrar o conteúdo, informações e ações. Esses usuários também
            podem acessar as métricas do evento.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="linkPurple"
              className="gap-2 self-start sm:self-center"
              type="button"
              onClick={() => {
                setDialogOpen(true);
                setFoundCollaborator(null);
                reset();
              }}
            >
              <PlusIcon />
              Novo Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto text-center">
            <DialogTitle>Adicionar Colaborador</DialogTitle>
            <DialogDescription>
              Informe o CPF ou Email do colaborador que deseja adicionar.
            </DialogDescription>

            <Form {...form}>
              {foundCollaborator ? (
                <Input
                  value={`${foundCollaborator.name} (${foundCollaborator.email})`}
                  readOnly
                  className="w-full"
                />
              ) : (
                <form onSubmit={handleSubmit(onSearchSubmit)}>
                  <FormField
                    control={control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormControl>
                          <Input
                            placeholder="CPF ou Email"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
                    <Button type="submit" className="w-full sm:w-auto">
                      Buscar
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </Form>

            {foundCollaborator && (
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleBackToSearch}
                  className="w-full sm:w-auto"
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmCollaborator}
                  className="w-full sm:w-auto"
                >
                  Confirmar
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Colaborador</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collaborators?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="break-all">
                  {item.user.name} ({item.user.email})
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setCollaborators((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="w-full sm:w-auto"
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving && (
            <Loader2 className="animate-spin self-center w-4 h-4 mr-2" />
          )}
          Salvar alterações
        </Button>
      </div>
    </div>
  );
}
