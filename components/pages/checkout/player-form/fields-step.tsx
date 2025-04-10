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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Player, TicketForm } from "@/interface/tickets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PlayerCard } from "../player-card";

const getFieldSchema = (hasCategories: boolean) =>
  z
    .object({
      categoryId: hasCategories
        ? z.string().min(1, "Categoria obrigatória")
        : z.string().optional(),
    })
    .catchall(z.string({ message: "Campo requerido" }).min(1));

interface Props {
  player: Player;
  currentTicket: TicketForm;
  onSave: (updated: Player) => void;
  onClose: () => void;
}

export function FieldsStep({ player, currentTicket, onSave, onClose }: Props) {
  const hasCategories = currentTicket.ticketType.categories.length > 0;

  const form = useForm<Record<string, string> & { categoryId?: string }>({
    resolver: zodResolver(getFieldSchema(hasCategories)),
    defaultValues: {
      ...(player.personalizedField?.reduce(
        (acc, f) => ({ ...acc, [f.personalizedFieldId]: f.answer }),
        {}
      ) || {}),
      categoryId: player.category?.id || "",
    },
  });

  const onSubmit = (data: Record<string, string> & { categoryId?: string }) => {
    const updated: Player = {
      ...player,
      personalizedField: Object.entries(data)
        .filter(([key]) => key !== "categoryId")
        .map(([id, answer]) => ({
          personalizedFieldId: id,
          answer,
        })),
      category:
        currentTicket.ticketType.categories.find(
          (c) => c.id === data.categoryId
        ) || player.category,
    };

    onSave(updated);
    onClose();
  };

  const categories = () => {
    if (currentTicket.players.length === 0) {
      return currentTicket.ticketType.categories.map((cat) => ({
        value: cat.id,
        label: cat.title,
      }));
    } else {
      if (
        currentTicket.players.some(
          (p) => p.category?.restriction === "SAME_CATEGORY"
        )
      ) {
        const category = currentTicket.players.filter(
          (p) => p.category?.restriction === "SAME_CATEGORY"
        );
        return currentTicket.ticketType.categories
          .filter((cat) => cat.id === category[0].category.id)
          .map((cat) => ({
            value: cat.id,
            label: cat.title,
          }));
      } else {
        return currentTicket.ticketType.categories.map((cat) => ({
          value: cat.id,
          label: cat.title,
        }));
      }
    }
  };

  return (
    <>
      <PlayerCard player={player} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {currentTicket.ticketType.categories.length > 0 && (
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories().map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {currentTicket.ticketType.personalizedFields.map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{field.requestTitle}</FormLabel>
                  <FormControl>
                    {field.type === "text" ? (
                      <Input {...formField} />
                    ) : (
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
                    )}
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
    </>
  );
}
