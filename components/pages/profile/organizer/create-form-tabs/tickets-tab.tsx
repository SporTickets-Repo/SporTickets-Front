"use client";

import { useCallback, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  MinusIcon,
  PlusIcon,
  SaveIcon,
  Ticket,
  Trash2Icon,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/datePicker";
import { useCreateEventContext } from "@/context/create-event";
import { ticketService } from "@/service/ticket";
import { mutate } from "swr";
import { OptionsInputField } from "../options-input-field";

interface TicketItemProps {
  index: number;
  removeTicket: (index: number) => void;
}

function TicketItem({ index, removeTicket }: TicketItemProps) {
  const { control, watch } = useFormContext();
  const currentUserType = watch(`ticketTypes.${index}.userType`);
  const [openLots, setOpenLots] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<string[]>([`ticket-${index}`]);

  const lotsArray = useFieldArray({
    control,
    name: `ticketTypes.${index}.ticketLots`,
  });
  const customFieldsArray = useFieldArray({
    control,
    name: `ticketTypes.${index}.personalizedFields`,
  });
  const categoriesArray = useFieldArray({
    control,
    name: `ticketTypes.${index}.categories`,
  });

  const formattedValueMemo = useCallback((value: number | undefined) => {
    const val = Number(value || 0);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(val);
  }, []);

  return (
    <Accordion
      type="multiple"
      value={isOpen}
      onValueChange={setIsOpen}
      className="border rounded-md shadow-sm overflow-hidden"
    >
      <AccordionItem value={`ticket-${index}`} className="border-0">
        <AccordionTrigger className="px-4 py-3 border-b hover:no-underline hover:bg-muted/50">
          <div className="flex items-center justify-between w-full">
            <span className="text-lg font-semibold">
              {watch(`ticketTypes.${index}.name`) || "Novo Ingresso"}
            </span>
            <div className="flex items-center gap-3 mr-3">
              <Badge
                variant={currentUserType === "ATHLETE" ? "default" : "success"}
              >
                {currentUserType === "ATHLETE" ? "Atleta" : "Espectador"}
              </Badge>
              <Button
                variant="default-inverse"
                type="button"
                size="icon"
                className="p-[10px] [&_svg]:size-4 rounded-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTicket(index);
                }}
              >
                <Trash2Icon />
              </Button>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent style={{ padding: "0 10px" }} className="p-0 ">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="basic-info" className="px-0 py-2">
              <AccordionTrigger className="text-base font-medium">
                Informações básicas
              </AccordionTrigger>
              <AccordionContent
                style={{ padding: 0 }}
                className="pt-4 pb-5 px-4 border rounded-b-xl rounded-t-none border-t-0"
              >
                <div className="grid gap-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`ticketTypes.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título do ingresso</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Masculino Dupla"
                              className="bg-muted"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`ticketTypes.${index}.userType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de usuário</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="bg-muted">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ATHLETE">Atleta</SelectItem>
                              <SelectItem value="VIEWER">Espectador</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name={`ticketTypes.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Inclui short e camiseta"
                            className="resize-none bg-muted"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {currentUserType === "ATHLETE" && (
                    <FormField
                      control={control}
                      name={`ticketTypes.${index}.teamSize`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4" />
                              Quantidade de atletas por equipe
                            </FormLabel>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  field.onChange(Math.max(0, field.value - 1))
                                }
                              >
                                <MinusIcon className="h-4 w-4" />
                              </Button>
                              <Input
                                className="w-24 h-10 text-center bg-muted "
                                {...field}
                                onChange={(e) => {
                                  const numericVal = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  field.onChange(Number(numericVal) || 0);
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  field.onChange((field.value || 0) + 1)
                                }
                              >
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {currentUserType === "ATHLETE" && (
              <AccordionItem value="categories" className="px-0 py-2">
                <AccordionTrigger className="text-base font-medium">
                  <div className="flex items-center justify-between w-full">
                    <span>Categorias</span>
                    <span className="text-xs font-normal text-muted-foreground mr-2">
                      {categoriesArray.fields.length}{" "}
                      {categoriesArray.fields.length === 1
                        ? "categoria"
                        : "categorias"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent
                  style={{ padding: 0 }}
                  className="pt-4 pb-2 px-4 border rounded-b-xl rounded-t-none border-t-0"
                >
                  <div className="space-y-4">
                    {categoriesArray.fields.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        Nenhuma categoria adicionada
                      </div>
                    )}

                    {categoriesArray.fields.map((cat, catIndex) => (
                      <div
                        key={cat.id}
                        className="grid sm:grid-cols-[1fr_100px_1fr_60px] gap-2 items-end"
                      >
                        <FormField
                          control={control}
                          name={`ticketTypes.${index}.categories.${catIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Título da categoria"
                                  className="bg-muted"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`ticketTypes.${index}.categories.${catIndex}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantidade</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="0"
                                  className="bg-muted"
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const numericVal = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    field.onChange(Number(numericVal) || 0);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`ticketTypes.${index}.categories.${catIndex}.restriction`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Restrição</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="bg-muted">
                                    <SelectValue placeholder="Selecione a restrição" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="SAME_CATEGORY">
                                      Mesma Categoria
                                    </SelectItem>
                                    <SelectItem value="NONE">
                                      Nenhuma
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          variant="default-inverse"
                          type="button"
                          size="icon"
                          className="py-[14px] px-5 [&_svg]:size-5 rounded-sm mr-2"
                          onClick={() => categoriesArray.remove(catIndex)}
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    ))}

                    <div className="flex justify-end mt-4">
                      <Button
                        variant="link"
                        type="button"
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                          categoriesArray.append({
                            title: "",
                            quantity: 0,
                            restriction: "NONE",
                          })
                        }
                      >
                        <PlusIcon className="h-4 w-4" />
                        Adicionar Categoria
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="lots" className="px-0 py-2">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center justify-between w-full">
                  <span>Lotes</span>
                  <span className="text-xs font-normal text-muted-foreground mr-2">
                    {lotsArray.fields.length}{" "}
                    {lotsArray.fields.length === 1 ? "lote" : "lotes"}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent
                style={{ padding: 0 }}
                className="pt-4 pb-2 px-2 border rounded-b-xl rounded-t-none border-t-0"
              >
                <div className="space-y-4">
                  {lotsArray.fields.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhum lote adicionado
                    </div>
                  )}

                  <Accordion
                    value={openLots}
                    onValueChange={(val) => setOpenLots(val)}
                    type="multiple"
                    className="space-y-4"
                  >
                    {lotsArray.fields.map((lot, lotIndex) => (
                      <AccordionItem
                        key={lot.id}
                        value={`lot-${lotIndex}`}
                        className="overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">
                              {watch(
                                `ticketTypes.${index}.ticketLots.${lotIndex}.name`
                              ) || `Lote ${lotIndex + 1}`}
                            </span>
                            <div className="flex items-center gap-3 mr-2">
                              <FormField
                                control={control}
                                name={`ticketTypes.${index}.ticketLots.${lotIndex}.isActive`}
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2 m-0">
                                    <FormControl>
                                      <Switch
                                        onClick={(e) => e.stopPropagation()}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <Label className="text-xs !m-0 !ml-2">
                                      Ativo
                                    </Label>
                                  </FormItem>
                                )}
                              />
                              <Button
                                variant="default-inverse"
                                type="button"
                                size="icon"
                                className="p-[10px] [&_svg]:size-4 rounded-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  lotsArray.remove(lotIndex);
                                }}
                              >
                                <Trash2Icon />
                              </Button>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent
                          style={{ padding: 0 }}
                          className="pt-4 pb-5 px-4 border rounded-b-xl rounded-t-none border-t-0"
                        >
                          <div className="grid gap-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <FormField
                                control={control}
                                name={`ticketTypes.${index}.ticketLots.${lotIndex}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome do lote</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Lote Inicial"
                                        className="bg-muted"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={control}
                                name={`ticketTypes.${index}.ticketLots.${lotIndex}.price`}
                                render={({ field }) => {
                                  const formattedValue = formattedValueMemo(
                                    field.value
                                  );

                                  return (
                                    <FormItem>
                                      <FormLabel>Preço do lote</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="R$ 0,00"
                                          inputMode="decimal"
                                          className="bg-muted"
                                          value={formattedValue}
                                          onChange={(e) => {
                                            const raw = e.target.value
                                              .replace(/\D/g, "")
                                              .replace(/^0+/, "");

                                            const cents = Number(raw) / 100;
                                            field.onChange(cents);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  );
                                }}
                              />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                              <FormField
                                control={control}
                                name={`ticketTypes.${index}.ticketLots.${lotIndex}.startDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Data e hora de início</FormLabel>
                                    <FormControl>
                                      <DatePicker
                                        date={
                                          field?.value
                                            ? new Date(field.value)
                                            : undefined
                                        }
                                        setDate={field.onChange}
                                        showTime
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={control}
                                name={`ticketTypes.${index}.ticketLots.${lotIndex}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Data e hora de término
                                    </FormLabel>
                                    <FormControl>
                                      <DatePicker
                                        date={
                                          field?.value
                                            ? new Date(field.value)
                                            : undefined
                                        }
                                        setDate={field.onChange}
                                        showTime
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={control}
                              name={`ticketTypes.${index}.ticketLots.${lotIndex}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center justify-between">
                                    <FormLabel className="flex items-center gap-2">
                                      <Ticket className="h-4 w-4" />
                                      Quantidade disponível
                                    </FormLabel>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                          field.onChange(
                                            Math.max(0, field.value - 1)
                                          )
                                        }
                                      >
                                        <MinusIcon className="h-4 w-4" />
                                      </Button>
                                      <Input
                                        className="w-24 h-10 text-center bg-muted "
                                        value={field.value ?? ""}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(
                                            /\D/g,
                                            ""
                                          );
                                          field.onChange(Number(val) || 0);
                                        }}
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                          field.onChange((field.value || 0) + 1)
                                        }
                                      >
                                        <PlusIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <div className="flex justify-end mt-4">
                    <Button
                      variant="link"
                      type="button"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        const newIndex = lotsArray.fields.length;
                        lotsArray.append({
                          name: "",
                          price: 0,
                          startDate: "",
                          endDate: "",
                          quantity: 0,
                          isActive: true,
                        });
                        setOpenLots((prev) => [...prev, `lot-${newIndex}`]);
                      }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Adicionar novo lote
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom-fields" className="px-0 py-2">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center justify-between w-full">
                  <span>Campos personalizados</span>
                  <span className="text-xs font-normal text-muted-foreground mr-2">
                    {customFieldsArray.fields.length}{" "}
                    {customFieldsArray.fields.length === 1 ? "campo" : "campos"}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent
                style={{ padding: 0 }}
                className="pt-4 pb-2 px-4 border rounded-b-xl rounded-t-none border-t-0"
              >
                <div className="space-y-6">
                  {customFieldsArray.fields.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhum campo personalizado adicionado
                    </div>
                  )}

                  {customFieldsArray.fields.map((field, fieldIndex) => {
                    const responseType = watch(
                      `ticketTypes.${index}.personalizedFields.${fieldIndex}.type`
                    );

                    return (
                      <div
                        key={field.id}
                        className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end"
                      >
                        <FormField
                          control={control}
                          name={`ticketTypes.${index}.personalizedFields.${fieldIndex}.requestTitle`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pergunta</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ex: Qual clube você treina?"
                                  className="bg-muted"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div
                          className="grid gap-2"
                          style={{
                            gridTemplateColumns:
                              responseType === "checkbox"
                                ? "0.75fr 1fr"
                                : "1fr",
                          }}
                        >
                          <FormField
                            control={control}
                            name={`ticketTypes.${index}.personalizedFields.${fieldIndex}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de resposta</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="bg-muted">
                                    <SelectValue placeholder="Selecione o tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Texto</SelectItem>
                                    <SelectItem value="checkbox">
                                      Opções
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {responseType === "checkbox" && (
                            <FormField
                              control={control}
                              name={`ticketTypes.${index}.personalizedFields.${fieldIndex}.optionsList`}
                              render={({ field }) => (
                                <OptionsInputField
                                  name={field.name}
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                          )}
                        </div>

                        <Button
                          variant="default-inverse"
                          type="button"
                          size="icon"
                          className="py-[14px] px-5 [&_svg]:size-5 rounded-sm mr-2"
                          onClick={() => customFieldsArray.remove(fieldIndex)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}

                  <div className="flex justify-end mt-4">
                    <Button
                      variant="link"
                      type="button"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        customFieldsArray.append({
                          requestTitle: "",
                          type: "text",
                        })
                      }
                    >
                      <PlusIcon className="h-4 w-4" />
                      Adicionar campo
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function TicketsTab() {
  const { control, getValues, trigger } = useFormContext();
  const { eventId } = useCreateEventContext();
  const [isSaving, setIsSaving] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypes",
  });

  const addNewTicket = () => {
    append({
      name: "",
      description: "",
      userType: "ATHLETE",
      teamSize: 1,
      quantity: 1,
      categories: [],
      personalizedFields: [],
      ticketLots: [],
    });
  };

  const handleSave = async () => {
    if (!eventId) {
      toast.error("Event ID is missing.");
      return;
    }

    const isValid = await trigger("ticketTypes");

    console.log("isValid", isValid);

    if (!isValid) {
      toast.error("Corrija os erros nos tickets antes de salvar.");
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

    setIsSaving(true);
    try {
      const currentTickets = getValues("ticketTypes");
      await ticketService.upsertTickets(currentTickets, eventId);
      toast.success("Ingressos atualizados com sucesso!");
      try {
        await mutate(`/events/${eventId}`);
      } catch (err) {
        toast.error("Falha ao carregar ingressos.");
      }
    } catch (err: any) {
      toast.error("Falha ao salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Ingressos</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os tipos de ingressos disponíveis para o seu evento
          </p>
        </div>
        {fields.length > 0 && (
          <Button
            variant="linkPurple"
            onClick={addNewTicket}
            type="button"
            className="gap-2 self-start sm:self-center"
          >
            <PlusIcon />
            Novo Ingresso
          </Button>
        )}
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Nenhum ingresso cadastrado
          </h3>
          <p className="text-muted-foreground mb-6">
            Clique em "Novo Ingresso" para começar a configurar os ingressos do
            seu evento.
          </p>
          <Button onClick={addNewTicket} type="button" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Novo Ingresso
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((item, index) => (
            <TicketItem key={item.id} index={index} removeTicket={remove} />
          ))}
        </div>
      )}

      <div className="flex justify-end pt-6">
        <Button
          type="button"
          className="[&_svg]:size-5 items-center"
          onClick={handleSave}
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
