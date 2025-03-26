"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import {
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
import { Tiptap } from "@/components/ui/tiptap";
import { useCreateEventContext } from "@/context/create-event";
import { EventLevel, EventType, PaymentMethod } from "@/interface/event";
import { cn } from "@/lib/utils";
import { eventService } from "@/service/event";
import {
  translateEventLevel,
  translateEventType,
} from "@/utils/eventTranslations";
import { Circle, CircleCheck, ImageIcon, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaCreditCard, FaPix } from "react-icons/fa6";
import { toast } from "sonner";

const slugSugestion = (name: string): string => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
};

export function InfoTab() {
  const { control, watch, setValue, getValues, trigger, setError } =
    useFormContext();
  const eventName = watch("event.name");
  const eventSlug = watch("event.slug");
  const smallImageFile = watch("event.smallImageFile");
  const bannerImageFile = watch("event.bannerImageFile");

  const {
    eventLoading,
    eventTypes,
    eventLevels,
    eventTypesLoading,
    eventLevelsLoading,
    eventId,
    smallImagePreview,
    setSmallImagePreview,
    bannerImagePreview,
    setBannerImagePreview,
  } = useCreateEventContext();

  const [isSaving, setIsSaving] = useState(false);
  const eventImageRef = useRef<HTMLInputElement | null>(null);
  const mainImageRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (smallImageFile instanceof File) {
      const objectUrl = URL.createObjectURL(smallImageFile);
      setSmallImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [smallImageFile, setSmallImagePreview]);

  useEffect(() => {
    if (bannerImageFile instanceof File) {
      const objectUrl = URL.createObjectURL(bannerImageFile);
      setBannerImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [bannerImageFile, setBannerImagePreview]);

  const handleCepBlur = async (rawCep: string) => {
    const cepLimpo = rawCep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      if (!response.ok) {
        console.error("Erro ao buscar CEP");
        return;
      }
      const data = await response.json();
      if (data.erro) {
        console.error("CEP não encontrado na base da ViaCEP");
        toast.error("CEP não encontrado na base da ViaCEP");
        return;
      }
      setValue("event.street", data.logradouro || "", { shouldValidate: true });
      setValue("event.city", data.localidade || "", { shouldValidate: true });
      setValue("event.state", data.uf || "", { shouldValidate: true });
      setValue("event.neighborhood", data.bairro || "", {
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Erro na requisição ViaCEP:", error);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "smallImageFile" | "bannerImageFile"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(`event.${fieldName}`, file, { shouldValidate: true });
    }
  };

  const handleSave = async () => {
    const isValid = await trigger("event");
    if (!isValid) {
      toast.error("Por favor, corrija os erros antes de salvar.");
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
    const values = getValues();

    const infoTabData = {
      name: values.event.name,
      slug: values.event.slug,
      type: values.event.type,
      level: values.event.level,
      startDate: values.event.startDate
        ? new Date(values.event.startDate).toISOString()
        : undefined,
      endDate: values.event.endDate
        ? new Date(values.event.endDate).toISOString()
        : undefined,
      description: values.event.description,
      regulation: values.event.regulation,
      additionalInfo: values.event.additionalInfo,
      place: values.event.place,
      paymentMethods: values.event.paymentMethods,
      address: {
        zipCode: values.event.cep,
        street: values.event.street,
        number: values.event.addressNumber,
        complement: values.event.complement,
        neighborhood: values.event.neighborhood,
        city: values.event.city,
        state: values.event.state,
      },
      bannerImageFile: values.event.bannerImageFile,
      smallImageFile: values.event.smallImageFile,
    };

    const formData = new FormData();
    Object.entries(infoTabData).forEach(([key, value]) => {
      if (key === "address" && value) {
        Object.entries(value).forEach(([addrKey, addrValue]) => {
          if (addrValue) {
            formData.append(`address[${addrKey}]`, String(addrValue));
          }
        });
      } else if (key === "bannerImageFile" && value) {
        formData.append("banner", value);
      } else if (key === "smallImageFile" && value) {
        formData.append("small", value);
      } else if (key === "paymentMethods" && Array.isArray(value)) {
        value.forEach((method) => formData.append("paymentMethods", method));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    try {
      await eventService.putEvent(eventId as string, formData);
      toast.success("Alterações salvas com sucesso!");
    } catch (error: any) {
      if (error.response?.status === 409) {
        setError("event.slug", {
          type: "manual",
          message: "Já existe um evento com essa URL.",
        });

        setTimeout(() => {
          const slugElement = document.querySelector<HTMLInputElement>(
            "[id$='-form-item-message']"
          );
          if (slugElement) {
            slugElement.scrollIntoView({ behavior: "smooth", block: "center" });
            slugElement.focus();
          }
        }, 100);

        toast.error("Já existe um evento com essa URL.");
        return;
      }

      console.error(error);
      toast.error("Erro ao salvar alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  if (eventTypesLoading || eventLevelsLoading || eventLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin self-center w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full px-0 sm:px-6">
      {/* Page Title */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Informações do evento
        </h1>
      </div>

      {/* Images Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-muted-foreground">
          Imagens do evento
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-auto sm:h-40">
          <FormField
            control={control}
            name="event.smallImageFile"
            render={({ field, fieldState }) => (
              <FormItem className="w-full sm:w-1/3">
                <div
                  className="border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors h-32 sm:h-[90%] flex flex-col items-center justify-center gap-2"
                  onClick={() => eventImageRef.current?.click()}
                >
                  {smallImagePreview ? (
                    <Image
                      src={smallImagePreview}
                      alt="Imagem do evento"
                      width={600}
                      height={400}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex flex-col justify-center items-center p-2 bg-gray-100 rounded-lg w-full h-full text-center">
                      <ImageIcon className="w-4 h-4" />
                      <p className="text-sm">Menor</p>
                      <p className="text-xs text-muted-foreground">
                        Sugerido: 1200x600 px
                      </p>
                    </div>
                  )}
                </div>
                <FormControl>
                  <input
                    ref={eventImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, "smallImageFile")}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="event.bannerImageFile"
            render={({ field, fieldState }) => (
              <FormItem className="w-full sm:w-2/3">
                <div
                  className="border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors h-32 sm:h-[90%] flex flex-col items-center justify-center gap-2"
                  onClick={() => mainImageRef.current?.click()}
                >
                  {bannerImagePreview ? (
                    <Image
                      src={bannerImagePreview}
                      alt="Imagem maior"
                      width={1920}
                      height={1080}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col justify-center items-center p-2 bg-gray-100 rounded-lg w-full h-full text-center">
                      <Upload className="w-4 h-4" />
                      <p className="text-sm">Imagem maior</p>
                      <p className="text-xs text-muted-foreground">
                        Sugerido: 1920x480 px
                      </p>
                    </div>
                  )}
                </div>
                <FormControl>
                  <input
                    ref={mainImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, "bannerImageFile")}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* About Event Section */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium text-muted-foreground">
          Sobre o evento
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="event.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do evento</FormLabel>
                  <FormControl>
                    <Input placeholder="Copa dos Craques" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="event.slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    URL do evento
                    {eventName &&
                      eventName.length > 3 &&
                      eventSlug !== slugSugestion(eventName) && (
                        <span className="font-normal pl-2">
                          sugestão:{" "}
                          <button
                            className="text-blue-400 hover:text-blue-600"
                            type="button"
                            onClick={() =>
                              setValue("event.slug", slugSugestion(eventName), {
                                shouldValidate: true,
                              })
                            }
                          >
                            {slugSugestion(eventName)}
                          </button>
                        </span>
                      )}
                  </FormLabel>
                  <div className="flex items-center">
                    <Input
                      className="rounded-r-none"
                      disabled
                      value="sportickets.com.br/"
                    />
                    <FormControl>
                      <Input
                        placeholder="copa-dos-craques"
                        className="rounded-l-none"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="event.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Esporte</FormLabel>
                  <FormControl>
                    <Select
                      key={field.value}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={eventTypesLoading}
                    >
                      <SelectTrigger className="bg-muted">
                        <SelectValue placeholder="Selecione o esporte" />
                      </SelectTrigger>
                      <SelectContent>
                        {!eventTypesLoading ? (
                          (eventTypes as EventType[])
                            ?.sort((a, b) =>
                              a === EventType.GENERAL
                                ? -1
                                : b === EventType.GENERAL
                                ? 1
                                : a.localeCompare(b)
                            )
                            .map((type) => (
                              <SelectItem key={type} value={type}>
                                {translateEventType(type)}
                              </SelectItem>
                            ))
                        ) : (
                          <SelectItem value="loading" disabled>
                            Carregando...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="event.level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível da competição</FormLabel>
                  <FormControl>
                    <Select
                      key={field.value}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={eventLevelsLoading}
                    >
                      <SelectTrigger className="bg-muted">
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {!eventLevelsLoading ? (
                          (eventLevels as EventLevel[])
                            ?.sort((a, b) =>
                              a === EventLevel.GENERAL
                                ? -1
                                : b === EventLevel.GENERAL
                                ? 1
                                : a.localeCompare(b)
                            )
                            .map((level) => (
                              <SelectItem key={level} value={level}>
                                {translateEventLevel(level)}
                              </SelectItem>
                            ))
                        ) : (
                          <SelectItem value="loading" disabled>
                            Carregando...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="event.startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de início</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field?.value ? new Date(field.value) : undefined}
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
              name="event.endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de encerramento</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field?.value ? new Date(field.value) : undefined}
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
            name="event.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do evento</FormLabel>
                <FormControl>
                  <Tiptap
                    onChange={(value: string) =>
                      setValue("event.description", value, {
                        shouldValidate: true,
                      })
                    }
                    initialContent={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="event.regulation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regulamento</FormLabel>
                <FormControl>
                  <Tiptap
                    onChange={(value: string) =>
                      setValue("event.regulation", value, {
                        shouldValidate: true,
                      })
                    }
                    initialContent={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="event.additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informações adicionais</FormLabel>
                <FormControl>
                  <Tiptap
                    onChange={(value: string) =>
                      setValue("event.additionalInfo", value, {
                        shouldValidate: true,
                      })
                    }
                    initialContent={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* Address Section */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium text-muted-foreground">Endereço</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="event.place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do local</FormLabel>
                  <FormControl>
                    <Input placeholder="Estádio Municipal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="event.cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="00000-000"
                      {...field}
                      onBlur={() => handleCepBlur(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="event.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="event.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF</FormLabel>
                  <FormControl>
                    <Input placeholder="UF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="event.neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="event.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="event.addressNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="Número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="event.complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Complemento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium text-muted-foreground">Pagamento</h2>
        <FormField
          control={control}
          name="event.paymentMethods"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "justify-start gap-2 text-sm w-fit text-wrap h-fit text-start",
                      {
                        "text-primary border-primary border":
                          field.value?.includes(PaymentMethod.CREDIT_CARD),
                      }
                    )}
                    onClick={() => {
                      const current = field.value || [];
                      if (current.includes(PaymentMethod.CREDIT_CARD)) {
                        field.onChange(
                          current.filter(
                            (item: string) => item !== PaymentMethod.CREDIT_CARD
                          )
                        );
                      } else {
                        field.onChange([...current, PaymentMethod.CREDIT_CARD]);
                      }
                    }}
                  >
                    <FaCreditCard className="w-4 h-4" />
                    Cartão de Crédito
                    {field.value?.includes(PaymentMethod.CREDIT_CARD) ? (
                      <CircleCheck className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "justify-start gap-2 w-fit text-wrap h-fit text-start",
                      {
                        "text-primary border-primary border":
                          field.value?.includes(PaymentMethod.PIX),
                      }
                    )}
                    onClick={() => {
                      const current = field.value || [];
                      if (current.includes(PaymentMethod.PIX)) {
                        field.onChange(
                          current.filter(
                            (item: string) => item !== PaymentMethod.PIX
                          )
                        );
                      } else {
                        field.onChange([...current, PaymentMethod.PIX]);
                      }
                    }}
                  >
                    <FaPix className="w-4 h-4" />
                    Pix
                    {field.value?.includes(PaymentMethod.PIX) ? (
                      <CircleCheck className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

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
