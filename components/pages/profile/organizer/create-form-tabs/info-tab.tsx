import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import {
  Circle,
  CircleCheck,
  CreditCard,
  ImageIcon,
  QrCode,
  Upload,
} from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";

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
  const { control, watch, setValue } = useFormContext();

  const eventName = watch("event.name");
  const eventSlug = watch("event.slug");

  const eventImagePreview = watch("smallImageFile") || null;
  const mainImagePreview = watch("bannerImageFile") || null;

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "smallImageFile" | "bannerImageFile"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setValue(fieldName, previewUrl);
    }
  };

  const eventImageRef = useRef<HTMLInputElement | null>(null);
  const mainImageRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-6 max-w-full px-4 sm:px-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-medium text-[#333333]">
          Informações do evento
        </h1>
      </div>

      {/* Imagens (pequena e maior) */}
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 h-auto sm:h-40">
        <div className="w-full sm:w-1/3">
          <FormLabel htmlFor="event-cover" className="text-muted-foreground">
            Imagem do evento
          </FormLabel>
          <div
            className="mt-2 border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors h-32 sm:h-[90%] flex flex-col items-center justify-center gap-2"
            onClick={() => eventImageRef.current?.click()}
          >
            {eventImagePreview ? (
              <Image
                src={eventImagePreview}
                alt="Imagem do evento"
                width={600}
                height={400}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex flex-col justify-center items-center p-2 bg-gray-100 rounded-lg w-full h-full">
                <ImageIcon className="w-4 h-4" />
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm">Menor</p>
                  <p className="text-xs text-muted-foreground">600x400 px</p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={eventImageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, "smallImageFile")}
          />
        </div>

        <div className="w-full sm:w-2/3">
          <FormLabel className="invisible">Spacer</FormLabel>
          <div
            className="sm:mt-2 border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors h-32 sm:h-[90%] flex flex-col items-center justify-center gap-2"
            onClick={() => mainImageRef.current?.click()}
          >
            {mainImagePreview ? (
              <Image
                src={mainImagePreview}
                alt="Imagem maior"
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col justify-center items-center p-2 bg-gray-100 rounded-lg w-full h-full">
                <Upload className="w-4 h-4" />
                <p className="text-sm">Imagem maior</p>
                <p className="text-xs text-muted-foreground">1920x1080 px</p>
              </div>
            )}
          </div>
          <input
            ref={mainImageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, "bannerImageFile")}
          />
        </div>
      </div>

      {/* Sobre o evento */}
      <div className="space-y-4">
        <FormLabel className="text-muted-foreground">Sobre o evento</FormLabel>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nome do evento */}
          <FormField
            control={control}
            name="event.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="event-name">Nome do evento</FormLabel>
                <FormControl>
                  <Input
                    id="event-name"
                    placeholder="Copa dos Craques"
                    className="mt-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* URL do evento (com sugestão e input "domain" desabilitado) */}
          <FormField
            control={control}
            name="event.slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="event-slug">
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

                <div className="flex items-center mt-2">
                  {/* Input desabilitado com domínio fixo */}
                  <Input
                    className="rounded-r-none"
                    disabled
                    value="sportickets.com.br/"
                  />

                  {/* Input para o slug propriamente dito */}
                  <FormControl>
                    <Input
                      id="event-slug"
                      placeholder="copa-dos-craques"
                      className="rounded-l-none"
                      value={field.value || ""}
                      onChange={(e) => {
                        let value = e.target.value
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o esporte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="football">Futebol</SelectItem>
                      <SelectItem value="futsal">Futsal</SelectItem>
                      <SelectItem value="society">Society</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="event.competitionLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível da competição</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amateur">Amador</SelectItem>
                      <SelectItem value="semi-pro">
                        Semi-profissional
                      </SelectItem>
                      <SelectItem value="pro">Profissional</SelectItem>
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
                <FormLabel htmlFor="event-start-date">Data de início</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    id="event-start-date"
                    className="mt-2"
                    {...field}
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
                <FormLabel htmlFor="event-end-date">
                  Data de encerramento
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    id="event-end-date"
                    className="mt-2"
                    {...field}
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
              <FormLabel htmlFor="event-description">
                Descrição do evento
              </FormLabel>
              <FormControl>
                <Tiptap
                  onChange={(value: string) => {
                    setValue("event.description", value, {
                      shouldValidate: true,
                    });
                  }}
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
              <FormLabel htmlFor="event-regulation">Regulamento</FormLabel>
              <FormControl>
                <Tiptap
                  onChange={(value: string) => {
                    setValue("event.regulation", value, {
                      shouldValidate: true,
                    });
                  }}
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
              <FormLabel htmlFor="event-additional-information">
                Informações adicionais
              </FormLabel>
              <FormControl>
                <Tiptap
                  onChange={(value: string) => {
                    setValue("event.additionalInfo", value, {
                      shouldValidate: true,
                    });
                  }}
                  initialContent={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Endereço */}
        <FormLabel className="text-muted-foreground">Endereço</FormLabel>
        <FormField
          control={control}
          name="event.place"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="event-place">Nome do local</FormLabel>
              <FormControl>
                <Input
                  id="event-place"
                  placeholder="Estádio Municipal"
                  className="mt-2"
                  {...field}
                />
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
              <FormLabel htmlFor="event-cep">CEP</FormLabel>
              <FormControl>
                <Input
                  id="event-cep"
                  placeholder="00000-000"
                  className="mt-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="event.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="event-city">Cidade</FormLabel>
                <FormControl>
                  <Input
                    id="event-city"
                    placeholder="Cidade"
                    className="mt-2"
                    {...field}
                  />
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
                <FormLabel htmlFor="event-state">UF</FormLabel>
                <FormControl>
                  <Input
                    id="event-state"
                    placeholder="UF"
                    className="mt-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="event.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="event-street">Rua</FormLabel>
                <FormControl>
                  <Input
                    id="event-street"
                    placeholder="Rua"
                    className="mt-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="event.address-number"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="event-address-number">Número</FormLabel>
                <FormControl>
                  <Input
                    id="event-address-number"
                    placeholder="Número"
                    className="mt-2"
                    {...field}
                  />
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
                <FormLabel htmlFor="event-complement">Complemento</FormLabel>
                <FormControl>
                  <Input
                    id="event-complement"
                    placeholder="Complemento"
                    className="mt-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Pagamento */}
      <div className="space-y-4">
        <FormField
          control={control}
          name="event.paymentMethods"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-lg">
                Pagamento
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("justify-start gap-2 text-sm", {
                      "text-sporticket-purple border-sporticket-purple border":
                        field.value?.includes("credit"),
                    })}
                    onClick={() => {
                      const current = field.value || [];
                      if (current.includes("credit")) {
                        field.onChange(
                          current.filter((item: string) => item !== "credit")
                        );
                      } else {
                        field.onChange([...current, "credit"]);
                      }
                    }}
                  >
                    <CreditCard className="w-4 h-4" />
                    Cartão de Crédito/Débito
                    {field.value?.includes("credit") ? (
                      <CircleCheck className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className={cn("justify-start gap-2", {
                      "text-sporticket-purple border-sporticket-purple border":
                        field.value?.includes("pix"),
                    })}
                    onClick={() => {
                      const current = field.value || [];
                      if (current.includes("pix")) {
                        field.onChange(
                          current.filter((item: string) => item !== "pix")
                        );
                      } else {
                        field.onChange([...current, "pix"]);
                      }
                    }}
                  >
                    <QrCode className="w-4 h-4" />
                    Pix
                    {field.value?.includes("pix") ? (
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
      </div>
    </div>
  );
}
