"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateEventContext } from "@/context/create-event";
import { CreateEventFormValues } from "@/schemas/createEventSchema";
import { bracketService } from "@/service/bracket";
import { rankingService } from "@/service/ranking";
import { Loader2, PlusIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

export function IntegrationsTab() {
  const [isSaving, setIsSaving] = useState(false);
  const [openBrackets, setOpenBrackets] = useState<string[]>([]);
  const [openRankings, setOpenRankings] = useState<string[]>([]);
  const { eventId } = useCreateEventContext();

  const { control, trigger, getValues } =
    useFormContext<CreateEventFormValues>();

  const bracketsArray = useFieldArray({
    control,
    name: "bracket",
  });

  const rankingsArray = useFieldArray({
    control,
    name: "ranking",
  });

  async function handleSaveIntegrations() {
    const isValidBracket = await trigger("bracket");
    const isValidRanking = await trigger("ranking");

    if (!isValidBracket) {
      toast.error("Corrija os erros nos cupons antes de salvar.");
      const firstErrorElement = document.querySelector(
        "[id$='-form-item-message']"
      );
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    if (!isValidRanking) {
      toast.error("Corrija os erros nos rankings antes de salvar.");
      const firstErrorElement = document.querySelector(
        "[id$='-form-item-message']"
      );
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    try {
      setIsSaving(true);

      const formValues = getValues();
      const { bracket, ranking } = formValues;
      const response = await bracketService.updateBracketList(
        eventId as string,
        bracket.map((bracketItem) => ({
          ...bracketItem,
        }))
      );
      console.log("bracket salvos", response);
      const rankingResponse = await rankingService.updateRankingList(
        eventId as string,
        ranking.map((rankingItem) => ({
          ...rankingItem,
        }))
      );
      console.log("rankings salvos", rankingResponse);
      toast.success("Integrações salvas com sucesso.");
      await mutate(`/events/${eventId}`);
    } catch (err) {
      toast.error("Não foi possível salvar as integrações.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4 max-w-full px-0 sm:px-6">
      <div className="flex flex-row items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Chaves</h2>
          <p className="text-sm text-muted-foreground">
            Quantidade total: {bracketsArray.fields.length}
          </p>
        </div>
        <Button
          variant="linkPurple"
          className="gap-2 self-start sm:self-center"
          type="button"
          onClick={() => {
            bracketsArray.append({
              name: "",
              url: "",
              isActive: true,
            });
          }}
        >
          <PlusIcon /> Nova Chave
        </Button>
      </div>

      <Accordion
        value={openBrackets}
        onValueChange={(val) => setOpenBrackets(val)}
        type="multiple"
        className="rounded-md overflow-hidden space-y-4"
      >
        {bracketsArray.fields.map((item, index) => (
          <AccordionItem
            key={item.id}
            value={`bracket-${index}`}
            className="border-0 rounded-md"
          >
            <AccordionTrigger className="flex items-center justify-between bg-gray-50">
              <div className="flex justify-between w-full items-center">
                <div>
                  <h3 className="font-medium">
                    {item.name || `Chave ${index + 1}`}
                  </h3>
                </div>
                <div className="flex items-center gap-3 mr-3">
                  <FormField
                    control={control}
                    name={`bracket.${index}.isActive`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            onClick={(e) => e.stopPropagation()}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label className="font-light text-gray-600">
                          Ativo
                        </Label>
                      </FormItem>
                    )}
                  />

                  <span
                    className="p-[10px] [&_svg]:size-4 rounded-sm bg-sporticket-purple-100 text-sporticket-purple-800 shadow hover:bg-sporticket-purple-100/60"
                    onClick={() => {
                      bracketsArray.remove(index);
                    }}
                  >
                    <Trash2Icon />
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent
              style={{ padding: 0 }}
              className="pt-4 pb-5 px-4 border rounded-b-xl rounded-t-none border-t-0"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`bracket.${index}.id`}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <FormField
                  control={control}
                  name={`bracket.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Chave</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da Chave" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`bracket.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <hr className="my-10" />

      <div className="flex flex-row items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Rankings</h2>
          <p className="text-sm text-muted-foreground">
            Quantidade total: {rankingsArray.fields.length}
          </p>
        </div>
        <Button
          variant="linkPurple"
          className="gap-2 self-start sm:self-center"
          type="button"
          onClick={() => {
            rankingsArray.append({
              name: "",
              url: "",
              isActive: true,
            });
          }}
        >
          <PlusIcon /> Novo Ranking
        </Button>
      </div>

      <Accordion
        value={openRankings}
        onValueChange={(val) => setOpenRankings(val)}
        type="multiple"
        className="rounded-md overflow-hidden space-y-4"
      >
        {rankingsArray.fields.map((item, index) => (
          <AccordionItem
            key={item.id}
            value={`ranking-${index}`}
            className="border-0 rounded-md"
          >
            <AccordionTrigger className="flex items-center justify-between bg-gray-50">
              <div className="flex justify-between w-full items-center">
                <div>
                  <h3 className="font-medium">
                    {item.name || `Ranking ${index + 1}`}
                  </h3>
                </div>
                <div className="flex items-center gap-3 mr-3">
                  <FormField
                    control={control}
                    name={`ranking.${index}.isActive`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            onClick={(e) => e.stopPropagation()}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label className="font-light text-gray-600">
                          Ativo
                        </Label>
                      </FormItem>
                    )}
                  />

                  <span
                    className="p-[10px] [&_svg]:size-4 rounded-sm bg-sporticket-purple-100 text-sporticket-purple-800 shadow hover:bg-sporticket-purple-100/60"
                    onClick={() => {
                      rankingsArray.remove(index);
                    }}
                  >
                    <Trash2Icon />
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent
              style={{ padding: 0 }}
              className="pt-4 pb-5 px-4 border rounded-b-xl rounded-t-none border-t-0"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`ranking.${index}.id`}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <FormField
                  control={control}
                  name={`ranking.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Ranking</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do Ranking" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`ranking.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleSaveIntegrations}
          className="[&_svg]:size-5 items-center"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Salvando...
            </>
          ) : (
            <>
              Salvar alterações
              <SaveIcon className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
