"use client";
import { AuthStep } from "@/hooks/useAuthSteps";
import { useEffect, useState } from "react";

import { registerSchema } from "@/utils/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { useAuth } from "@/context/auth";
import { RegisterBody } from "@/interface/auth";
import { cn } from "@/lib/utils";
import { DatePicker } from "./ui/datePicker";
import PasswordStrengthMeter from "./ui/passwordStrengthMeter";
import { SelectItem } from "./ui/select";
import { SelectDemo } from "./ui/selectDemo";

type FormData = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  document: string;
  bornAt: Date;
  phone: string;
  sex: "MALE" | "FEMALE";
  cep: string;
};

interface StepRegisterProps {
  email: string;
  nextStep: (next: AuthStep) => void;
}

const StepRegister = ({ email, nextStep }: StepRegisterProps) => {
  const router = useRouter();
  const { registration } = useAuth();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    setValue("email", email);
  }, [email, setValue]);

  const onSubmit = async (data: FormData) => {
    const body = {
      name: data.name,
      document: data.document,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      bornAt: data.bornAt.toISOString(),
      cep: data.cep,
      sex: data.sex,
      phone: data.phone,
    } as RegisterBody;
    try {
      await registration(body);
      setSuccess(true);
    } catch (error: any) {
      console.error("Failed to register:", error.response.data.message);
      if (error.response.data.message === "CPF already exists") {
        setError("document", {
          type: "manual",
          message: "Documento já cadastrado",
        });
      }
      if (error.response.data.message === "Email already exists") {
        setError("email", {
          type: "manual",
          message: "E-mail já cadastrado",
        });
      }
      if (error.response.data.message === "Phone already exists") {
        setError("phone", {
          type: "manual",
          message: "Telefone já cadastrado",
        });
      }
    }
  };

  useEffect(() => {
    setValue("email", email);
  }, [email]);

  function formatCPF(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatCEP(value: string) {
    return value.replace(/\D/g, "").replace(/^(\d{5})(\d{1,3})/, "$1-$2");
  }

  function formatPhone(value: string) {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d{4})$/, "$1-$2");
    }
    return cleaned
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <div className="w-full space-y-4">
        <div className="space-y-2 mb-6">
          <Button
            type="button"
            variant="outline"
            className={cn("py-4 mb-4 px-0")}
            onClick={() => nextStep(AuthStep.ENTER_EMAIL)}
          >
            <ArrowLeft />
          </Button>

          <h1 className="text-2xl font-semibold tracking-tight">
            Parece que você é novo por aqui!
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie a sua conta e fique por dentro do melhores eventos da cidade.
          </p>
          {success && (
            <div className="bg-green-100 p-4 rounded-md text-green-600">
              <p>
                Cadastro realizado com sucesso! Você será redirecionado para a
                página inicial.
              </p>
            </div>
          )}
        </div>

        {/* Campos do Formulário */}
        <Input
          type="email"
          placeholder="E-mail"
          readOnly
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          type="text"
          placeholder="Nome Completo"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          type="text"
          maxLength={14}
          placeholder="Documento (CPF)"
          value={formatCPF(watch("document") || "")}
          onChange={(e) =>
            setValue("document", e.target.value.replace(/\D/g, ""))
          }
          error={errors.document?.message}
        />

        <Input
          type="text"
          maxLength={9}
          placeholder="CEP"
          value={formatCEP(watch("cep") || "")}
          onChange={(e) => setValue("cep", e.target.value.replace(/\D/g, ""))}
          error={errors.cep?.message}
        />

        <Input
          type="text"
          placeholder="Telefone"
          value={formatPhone(watch("phone") || "")}
          onChange={(e) => setValue("phone", e.target.value.replace(/\D/g, ""))}
          error={errors.phone?.message}
        />

        {/* DatePicker */}
        <DatePicker
          placeholder="Selecione a data de nascimento"
          date={watch("bornAt")}
          setDate={(date) => setValue("bornAt", date || new Date())}
        />

        <SelectDemo name="sex" control={control} placeholder="Selecione o sexo">
          <SelectItem value="MALE">Masculino</SelectItem>
          <SelectItem value="FEMALE">Feminino</SelectItem>
        </SelectDemo>

        {/* Senha e Validação */}
        <Input
          type="password"
          placeholder="Senha"
          {...register("password")}
          error={errors.password?.message}
          password
        />
        <PasswordStrengthMeter password={watch("password")} />

        <Input
          type="password"
          placeholder="Confirme sua Senha"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          password
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          <ArrowRight className="ml-1" />
        </Button>
      </div>
    </form>
  );
};

export default StepRegister;
