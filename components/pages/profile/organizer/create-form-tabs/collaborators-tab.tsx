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
import { userService } from "@/service/user";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface Collaborator {
  userId: string;
  name?: string;
  email?: string;
  role?: string;
}

interface UserByIdentifierResponse {
  exist: boolean;
  user: Collaborator;
}

export function CollaboratorsTab() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "collaborators",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [foundCollaborator, setFoundCollaborator] =
    useState<Collaborator | null>(null);

  const handleSearchCollaborator = async () => {
    setError("");
    try {
      const data: UserByIdentifierResponse = await userService.userByIdentifier(
        query
      );
      if (data.exist) {
        console.log(data.user);

        setFoundCollaborator(data.user);
      } else {
        setError("Colaborador não encontrado.");
      }
    } catch (err) {
      setError("Erro ao buscar colaborador.");
    }
  };

  const handleConfirmCollaborator = () => {
    if (foundCollaborator) {
      append({
        userId: foundCollaborator.userId,
        name: foundCollaborator.name,
      });
      setFoundCollaborator(null);
      setQuery("");
      setDialogOpen(false);
    }
  };

  const handleBackToSearch = () => {
    setFoundCollaborator(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Colaboradores</h2>
          <p className="text-sm text-muted-foreground">
            Quando você convida colaboradores para o seu evento, eles podem
            administrar o conteúdo, informações e ações. Esses usuários também
            podem acessar as métricas do evento.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              className="text-sporticket-purple w-full sm:w-auto"
              onClick={() => {
                setDialogOpen(true);
                setQuery("");
              }}
            >
              Novo Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto">
            <DialogTitle>Adicionar Colaborador</DialogTitle>
            <DialogDescription>
              Informe o CPF ou Email do colaborador que deseja adicionar.
            </DialogDescription>
            <div className="mt-4">
              {foundCollaborator ? (
                <Input
                  value={`${foundCollaborator.name} (${foundCollaborator.email})`}
                  readOnly
                  className="w-full"
                />
              ) : (
                <Input
                  placeholder="CPF ou Email"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full"
                />
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              {foundCollaborator ? (
                <>
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
                </>
              ) : (
                <Button
                  type="button"
                  onClick={handleSearchCollaborator}
                  className="w-full sm:w-auto"
                >
                  Buscar
                </Button>
              )}
            </DialogFooter>
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
            {fields.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="break-all">
                  <FormField
                    control={control}
                    name={`collaborators.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="User Id"
                            {...field}
                            readOnly
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
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
    </div>
  );
}
