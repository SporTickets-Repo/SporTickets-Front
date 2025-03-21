"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useAuth } from "@/context/auth";
import { UserSex } from "@/interface/user";
import { userService } from "@/service/user";
import { Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  document: z
    .string()
    .min(1, "Documento obrigatório")
    .regex(/^\d{11}$/, "Documento deve conter 11 dígitos numéricos"),
  email: z.string().min(3, "Email obrigatório").email("Email inválido"),
  phone: z
    .string()
    .min(1, "Telefone obrigatório")
    .regex(/^\d{10,11}$/, "Telefone deve conter 10 ou 11 dígitos numéricos"),
  sex: z.enum(Object.values(UserSex) as [string, ...string[]], {
    invalid_type_error: "Sexo obrigatório",
  }),
  bornAt: z
    .string()
    .min(1, "Data de nascimento obrigatória")
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Data inválida",
    })
    .refine(
      (value) => {
        const date = new Date(value);
        const now = new Date();
        return date < now;
      },
      {
        message: "Data de nascimento não pode ser no futuro",
      }
    ),

  cep: z
    .string()
    .min(1, "CEP obrigatório")
    .refine((value) => {
      return /^\d{8}$/.test(value);
    }, "CEP deve conter 8 dígitos numéricos"),

  imageFile: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof profileSchema>;

export function EditProfileDialog() {
  const { user, fetchUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profileImageUrl ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name ?? "",
      document: user?.document ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      sex: user?.sex ?? ("" as UserSex),
      bornAt: user?.bornAt ?? "",
      cep: user?.cep ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("document", user.document);
      form.setValue("email", user.email);
      form.setValue("phone", user.phone);
      form.setValue("sex", user.sex ?? "");
      form.setValue("bornAt", user.bornAt ?? "");
      form.setValue("cep", user.cep);
      setImagePreview(user?.profileImageUrl ?? null);
    }
  }, [user, form]);

  const onSubmit = async (data: FormData) => {
    console.log(data.imageFile);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("document", data.document);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("sex", data.sex);
    formData.append("bornAt", data.bornAt);
    formData.append("cep", data.cep);

    if (data.imageFile) {
      formData.append("imageFile", data.imageFile);
    }

    try {
      const response = await userService.updateUser(formData);
      if (response) {
        setOpen(false);
        toast.success("Perfil atualizado com sucesso!");
        fetchUser();
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default-inverse">Editar Perfil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            <DialogHeader className="items-center justify-center">
              <DialogTitle>Editar Perfil</DialogTitle>
              <Button
                className="absolute right-4 text-[15px] text-primary font-semibold !m-0"
                type="submit"
                variant="ghost"
                disabled={!form.formState.isValid}
              >
                Salvar
              </Button>
            </DialogHeader>

            {/* Imagem de Perfil (campo de arquivo registrado) */}
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                  <div
                    className="text-center flex justify-center cursor-pointer w-fit justify-self-center"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Imagem de Perfil"
                        height={160}
                        width={160}
                        className="w-40 h-40 rounded-full object-cover mb-2 cursor-pointer"
                        unoptimized
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-muted flex items-center justify-center mb-2 cursor-pointer hover:bg-muted/80 transition-colors">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                        const previewUrl = URL.createObjectURL(file);
                        setImagePreview(previewUrl);
                      }
                    }}
                  />
                </FormItem>
              )}
            />

            {/* Campo: Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Documento */}
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="Documento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Email (desabilitado) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Telefone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Sexo com Dropdown */}
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Masculino</SelectItem>
                      <SelectItem value="FEMALE">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Data de Nascimento com DatePicker */}
            <FormField
              control={form.control}
              name="bornAt"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value ? new Date(field.value) : undefined}
                      setDate={(date) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: CEP */}
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="CEP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
