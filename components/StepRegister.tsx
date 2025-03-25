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
    console.log(data);
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
      setTimeout(() => {
        nextStep(AuthStep.ENTER_EMAIL);
      }, 4000);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <div className="w-full space-y-4">
        <div className="space-y-2 mb-6">
          <Button
            type="button"
            variant="outline"
            className="p-4 mb-4"
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
                tela de login.
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
          placeholder="Documento (CPF)"
          {...register("document")}
          error={errors.document?.message}
        />
        <Input
          type="text"
          placeholder="CEP"
          {...register("cep")}
          error={errors.cep?.message}
        />

        {/* Campo de Telefone com Máscara */}
        <Input
          type="text"
          placeholder="Telefone"
          {...register("phone")}
          error={errors.phone?.message}
        />

        {/* DatePicker */}
        <DatePicker
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
        />
        <PasswordStrengthMeter password={watch("password")} />

        <Input
          type="password"
          placeholder="Confirme sua Senha"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Cadastrar
          <ArrowRight className="ml-1" />
        </Button>
      </div>
    </form>
  );
};

export default StepRegister;
