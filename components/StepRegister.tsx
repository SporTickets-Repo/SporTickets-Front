"use client";
import { AuthStep } from "@/hooks/useAuthSteps";
import { useEffect } from "react";

import { registerSchema } from "@/utils/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { DatePicker } from "./ui/datePicker";
import PasswordStrengthMeter from "./ui/passwordStrengthMeter";

type FormData = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  document: string;
  bornAt: Date;
  phone: string;
  sex: "MALE" | "FEMALE";
};

interface StepRegisterProps {
  email: string;
  nextStep: (next: AuthStep) => void;
}

const StepRegister = ({ email, nextStep }: StepRegisterProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    setValue("email", email);
  }, [email, setValue]);

  const onSubmit = async (data: FormData) => {
    console.log("Registrando usuário:", data);
    // Simulação de chamada à API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/home");
  };

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
        </div>

        {/* Campos do Formulário */}
        <Input
          type="email"
          placeholder="E-mail"
          readOnly
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

        {/* Campo de Sexo */}
        <select {...register("sex")} className="w-full p-3 border rounded-md">
          <option value="">Selecione o sexo</option>
          <option value="MALE">Masculino</option>
          <option value="FEMALE">Feminino</option>
        </select>

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

        {/* Botão de Cadastro */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          Cadastrar
          <ArrowRight className="ml-1" />
        </Button>
      </div>
    </form>
  );
};

export default StepRegister;
