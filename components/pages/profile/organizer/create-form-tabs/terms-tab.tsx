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
import type { CreateEventFormValues } from "@/schemas/createEventSchema";
import { eventService } from "@/service/event";
import {
  FileIcon,
  Loader2,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

export function TermsTab() {
  const [isSaving, setIsSaving] = useState(false);
  const [openTerms, setOpenTerms] = useState<string[]>([]);
  const { eventId } = useCreateEventContext();

  const {
    control,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateEventFormValues>();

  const termsArray = useFieldArray({
    control,
    name: "terms",
  });

  const watchedTerms = watch("terms");

  async function handleSaveTerms() {
    let hasError = false;
    watchedTerms.forEach((term, index) => {
      if (!term.id && !term.fileUrl && !term.file) {
        setValue(`terms.${index}.file`, undefined, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        hasError = true;
      }
    });

    if (hasError) {
      toast.error("Novos termos precisam ter um arquivo anexado.");
      return;
    }

    const isValid = await trigger("terms");

    if (!isValid) {
      toast.error("Corrija os erros nos termos antes de salvar.");
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
      const { terms } = formValues;

      const formData = new FormData();

      const termsData = terms.map((term) => ({
        id: term.id,
        title: term.title,
        isObligatory: term.isObligatory || false,
      }));

      formData.append("terms", JSON.stringify(termsData));

      terms.forEach((term, idx) => {
        if (term.file instanceof File) {
          formData.append(`files`, term.file);
          formData.append(`fileIndices`, idx.toString());
        }
      });

      await eventService.updateEventTerms(eventId as string, formData);

      toast.success("Termos salvos com sucesso.");
      await mutate(`/events/${eventId}`);
    } catch (err) {
      console.error("Erro ao salvar os termos:", err);
      toast.error("Não foi possível salvar os termos.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleFileChange(index: number, file: File | null) {
    if (file) {
      setValue(`terms.${index}.file`, file, {
        shouldValidate: true,
      });

      setValue(`terms.${index}.fileUrl`, "");
    }
  }

  return (
    <div className="space-y-4 max-w-full px-0 sm:px-6">
      <div className="flex flex-row items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Termos</h2>
          <p className="text-sm text-muted-foreground">
            Quantidade total: {termsArray.fields.length}
          </p>
        </div>
        <Button
          variant="linkPurple"
          className="gap-2 self-start sm:self-center"
          type="button"
          onClick={() => {
            termsArray.append({
              title: "",
              isObligatory: true,
              fileUrl: "",
            });

            setOpenTerms([...openTerms, `term-${termsArray.fields.length}`]);
          }}
        >
          <PlusIcon /> Novo Termo
        </Button>
      </div>

      <Accordion
        value={openTerms}
        onValueChange={(val) => setOpenTerms(val)}
        type="multiple"
        className="rounded-md overflow-hidden space-y-4"
      >
        {termsArray.fields.map((item, index) => {
          const isNewTerm = !item.id && !watchedTerms[index]?.fileUrl;

          const hasFileError = isNewTerm && !watchedTerms[index]?.file;

          return (
            <AccordionItem
              key={item.id}
              value={`term-${index}`}
              className="border-0 rounded-md"
            >
              <AccordionTrigger className="flex items-center justify-between bg-gray-50">
                <div className="flex justify-between w-full items-center">
                  <div>
                    <h3 className="font-medium">
                      {item.title || `Termo ${index + 1}`}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 mr-3">
                    <FormField
                      control={control}
                      name={`terms.${index}.isObligatory`}
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
                            Obrigatório
                          </Label>
                        </FormItem>
                      )}
                    />

                    <span
                      className="p-[10px] [&_svg]:size-4 rounded-sm bg-sporticket-purple-100 text-sporticket-purple-800 shadow hover:bg-sporticket-purple-100/60"
                      onClick={(e) => {
                        e.stopPropagation();
                        termsArray.remove(index);
                        setOpenTerms(
                          openTerms.filter((term) => term !== `term-${index}`)
                        );
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
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={control}
                    name={`terms.${index}.id`}
                    render={({ field }) => <input type="hidden" {...field} />}
                  />
                  <FormField
                    control={control}
                    name={`terms.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Termo</FormLabel>
                        <FormControl>
                          <Input placeholder="Título do Termo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Arquivo do Termo</FormLabel>

                    {!watchedTerms[index]?.fileUrl ? (
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={control}
                          name={`terms.${index}.file`}
                          render={({
                            field: { value, onChange, ...fieldProps },
                          }) => (
                            <FormItem>
                              <FormControl>
                                <label
                                  htmlFor={`term-file-${index}`}
                                  className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-md transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                                    hasFileError
                                      ? "border-red-500 hover:border-red-600"
                                      : "border-gray-300 hover:border-sporticket-purple-400"
                                  }`}
                                >
                                  <UploadIcon
                                    className={`h-5 w-5 ${
                                      hasFileError
                                        ? "text-red-500"
                                        : "text-sporticket-purple-600"
                                    }`}
                                  />
                                  <span
                                    className={`text-sm font-medium ${
                                      hasFileError
                                        ? "text-red-600"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {hasFileError
                                      ? "Arquivo obrigatório"
                                      : "Selecionar arquivo PDF"}
                                  </span>
                                  <Input
                                    type="file"
                                    accept=".pdf"
                                    id={`term-file-${index}`}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      handleFileChange(index, file);
                                    }}
                                    className="hidden"
                                    onClick={(e) => {
                                      (e.target as HTMLInputElement).value = "";
                                    }}
                                    {...fieldProps}
                                  />
                                </label>
                              </FormControl>
                              {hasFileError && (
                                <FormMessage>
                                  O arquivo do termo é obrigatório para novos
                                  termos
                                </FormMessage>
                              )}
                            </FormItem>
                          )}
                        />

                        {watchedTerms[index]?.file && (
                          <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                            <FileIcon className="h-5 w-5 text-blue-500" />
                            <span className="text-sm flex-1 truncate">
                              {watchedTerms[index].file.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                          <FileIcon className="h-5 w-5 text-blue-500" />
                          <a
                            href={watchedTerms[index].fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm flex-1 truncate"
                          >
                            {watchedTerms[index].fileUrl.split("/").pop()}
                          </a>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              window.open(
                                watchedTerms[index].fileUrl,
                                "_blank"
                              );
                            }}
                          >
                            Visualizar
                          </Button>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor={`term-file-${index}`}
                            className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-sporticket-purple-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <UploadIcon className="h-5 w-5 text-sporticket-purple-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Substituir arquivo
                            </span>
                            <Input
                              type="file"
                              accept=".pdf"
                              id={`term-file-${index}`}
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleFileChange(index, file);
                              }}
                              className="hidden"
                              onClick={(e) => {
                                (e.target as HTMLInputElement).value = "";
                              }}
                            />
                          </label>

                          {watchedTerms[index]?.file && (
                            <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                              <FileIcon className="h-5 w-5 text-blue-500" />
                              <span className="text-sm flex-1 truncate">
                                {watchedTerms[index].file.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {termsArray.fields.length === 0 && (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">
            Nenhum termo adicionado. Clique em "Novo Termo" para adicionar.
          </p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleSaveTerms}
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
