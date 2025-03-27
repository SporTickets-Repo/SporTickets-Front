"use client";

import { useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  MinusIcon,
  PlusIcon,
  Ticket,
  Trash2Icon,
  UserCheck,
} from "lucide-react";

import { DatePicker } from "@/components/ui/datePicker";
import { useCreateEventContext } from "@/context/create-event";
import { ticketService } from "@/service/ticket";

interface TicketItemProps {
  index: number;
  removeTicket: (index: number) => void;
}

function TicketItem({ index, removeTicket }: TicketItemProps) {
  const { control, watch } = useFormContext();
  const currentUserType = watch(`ticketTypes.${index}.userType`);
  const [openLots, setOpenLots] = useState<string[]>([]);

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

  return (
    <Accordion
      type="multiple"
      defaultValue={[`ticket-${index}`]}
      className="space-y-4 p-2"
    >
      <AccordionItem value={`ticket-${index}`} className="border rounded-md">
        <AccordionTrigger className="text-sporticket-purple">
          <div className="flex items-center justify-between w-full px-2">
            <h3 className="text-lg font-semibold">
              {watch(`ticketTypes.${index}.name`) || "Novo Ingresso"}
            </h3>
            <div className="gap-2 flex items-center">
              <FormField
                control={control}
                name={`ticketTypes.${index}.isActive`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        onClick={(e) => e.stopPropagation()}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label>Ativo</Label>
                  </FormItem>
                )}
              />
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTicket(index);
                }}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="bg-white py-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Informações básicas</h3>

              <FormField
                control={control}
                name={`ticketTypes.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do ingresso</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Masculino Dupla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`ticketTypes.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pequena Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Inclui short e camiseta"
                        className="resize-none bg-muted"
                        rows={6}
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
                    <Select value={field.value} onValueChange={field.onChange}>
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

              {currentUserType !== "VIEWER" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Categorias</h3>
                  {categoriesArray.fields.map((cat, catIndex) => (
                    <div
                      key={cat.id}
                      className="flex flex-col sm:flex-row items-center gap-4"
                    >
                      <FormField
                        control={control}
                        name={`ticketTypes.${index}.categories.${catIndex}.title`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Título da categoria"
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
                          <FormItem className="w-24">
                            <FormLabel>Quantidade</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0"
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  const numericVal = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  field.onChange(Number(numericVal));
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
                          <FormItem className="flex-1">
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
                                  <SelectItem value="NONE">Nenhuma</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        onClick={() => categoriesArray.remove(catIndex)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex flex-1 justify-end">
                    <Button
                      variant="outline"
                      type="button"
                      size="sm"
                      className="gap-2 text-sporticket-orange text-sm"
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
              )}

              <div className="flex flex-col gap-4">
                <FormField
                  control={control}
                  name={`ticketTypes.${index}.teamSize`}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        <FormLabel>Quantidade de atletas por equipe</FormLabel>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() =>
                            field.onChange(Math.max(0, field.value - 1))
                          }
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <Input
                          className="w-20 text-center p-0"
                          {...field}
                          onChange={(e) => {
                            const numericVal = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            field.onChange(Number(numericVal));
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => field.onChange(field.value + 1)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Lotes</h3>
                <Button
                  variant="ghost"
                  type="button"
                  className="gap-2 text-sporticket-orange text-sm"
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

              <Accordion
                value={openLots}
                onValueChange={(val) => setOpenLots(val)}
                type="multiple"
                className="space-y-4 p-2"
              >
                {lotsArray.fields.map((lot, lotIndex) => (
                  <AccordionItem
                    key={lot.id}
                    value={`lot-${lotIndex}`}
                    className="border rounded-md"
                  >
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full px-2">
                        <h3 className="text-lg font-semibold">
                          {watch(
                            `ticketTypes.${index}.ticketLots.${lotIndex}.name`
                          ) || `Lote ${lotIndex + 1}`}
                        </h3>
                        <div className="gap-2 flex items-center">
                          <FormField
                            control={control}
                            name={`ticketTypes.${index}.ticketLots.${lotIndex}.isActive`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    onClick={(e) => e.stopPropagation()}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <Label>Ativo</Label>
                              </FormItem>
                            )}
                          />
                          <Button
                            variant="ghost"
                            type="button"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              lotsArray.remove(lotIndex);
                            }}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white">
                      <div className="space-y-4 p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={control}
                            name={`ticketTypes.${index}.ticketLots.${lotIndex}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome do lote</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Lote Inicial"
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
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preço do lote</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="R$ 50,00"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                                <FormLabel>Data e hora de término</FormLabel>
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
                            <FormItem className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Ticket className="h-4 w-4" />
                                <FormLabel>Quantidade disponível</FormLabel>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-8 h-8 p-0"
                                  onClick={() =>
                                    field.onChange(Math.max(0, field.value - 1))
                                  }
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </Button>
                                <Input
                                  className="w-20 text-center"
                                  {...field}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    field.onChange(Number(val));
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-8 h-8 p-0"
                                  onClick={() =>
                                    field.onChange(field.value + 1)
                                  }
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Campos personalizados</h3>
                <Button
                  variant="ghost"
                  type="button"
                  className="gap-2 text-sporticket-orange text-sm"
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
              {customFieldsArray.fields.map((field, fieldIndex) => {
                const responseType = watch(
                  `ticketTypes.${index}.personalizedFields.${fieldIndex}.type`
                );
                const inputCount = responseType === "checkbox" ? 3 : 2;

                return (
                  <div
                    key={field.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex gap-4 w-full">
                      <div className={inputCount === 3 ? "w-1/3" : "w-1/2"}>
                        <FormField
                          control={control}
                          name={`ticketTypes.${index}.personalizedFields.${fieldIndex}.requestTitle`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pergunta</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ex: Qual clube você treina?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className={inputCount === 3 ? "w-1/3" : "w-1/2"}>
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
                      </div>
                      {responseType === "checkbox" && (
                        <div className="w-1/3">
                          <FormField
                            control={control}
                            name={`ticketTypes.${index}.personalizedFields.${fieldIndex}.optionsList`}
                            render={({
                              field: { onChange, onBlur, value, ref },
                            }) => (
                              <FormItem>
                                <FormLabel>Opções</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ex: sim, não, talvez"
                                    ref={ref}
                                    value={
                                      Array.isArray(value)
                                        ? value.join(", ")
                                        : value
                                    }
                                    onChange={(e) => {
                                      onChange(e.target.value);
                                    }}
                                    onBlur={(e) => {
                                      const optionsArray = e.target.value
                                        .split(",")
                                        .map((option) => option.trim())
                                        .filter((option) => option);
                                      onChange(optionsArray);
                                      onBlur();
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon"
                      className="text-sporticket-purple"
                      onClick={() => customFieldsArray.remove(fieldIndex)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function TicketsTab() {
  const { control, setValue, getValues } = useFormContext();
  const { eventId } = useCreateEventContext();
  const [isSaving, setIsSaving] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypes",
  });

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      try {
        const data = await ticketService.getTicketsByEventId(eventId);

        setValue("ticketTypes", data, { shouldDirty: false });
      } catch (err) {
        toast.error("Falha ao carregar ingressos.");
      }
    })();
  }, [eventId, setValue]);

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
      isActive: true,
    });
  };

  const handleSave = async () => {
    if (!eventId) {
      toast.error("Event ID is missing.");
      return;
    }

    setIsSaving(true);
    try {
      const currentTickets = getValues("ticketTypes");
      await ticketService.upsertTickets(currentTickets, eventId);
      toast.success("Ingressos atualizados com sucesso!");
    } catch (err: any) {
      toast.error("Falha ao salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Ingressos</h2>
          <p className="text-sm text-muted-foreground">
            Quantidade total: {fields.length}
          </p>
        </div>
        <Button
          onClick={addNewTicket}
          type="button"
          variant="outline"
          className="gap-2 text-sporticket-purple"
        >
          <PlusIcon className="h-4 w-4" />
          Novo Ingresso
        </Button>
      </div>

      {fields.map((item, index) => (
        <TicketItem key={item.id} index={index} removeTicket={remove} />
      ))}

      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum ingresso cadastrado. Clique em "Novo Ingresso" para começar.
        </div>
      )}

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
