"use client";
import { useAuth } from "@/context/auth";
import { AuthStep } from "@/hooks/useAuthSteps";
import { cn } from "@/lib/utils";
import { passwordSchema } from "@/utils/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface StepEnterPasswordProps {
  nextStep: (next: AuthStep) => void;
  email: string;
}

type FormData = {
  email: string;
  password: string;
};

const StepEnterPassword = ({ nextStep, email }: StepEnterPasswordProps) => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      setError("password", {
        type: "manual",
        message: "E-mail ou senha inválidos",
      });
      console.error("Error logging in:", error);
    }
  };

  useEffect(() => {
    setValue("email", email);
  }, [email]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full  max-w-md">
      <div className="w-full space-y-4">
        <div className="space-y-2  mb-6">
          <Button
            type="button"
            variant="outline"
            className={cn("py-4 mb-4 px-0")}
            onClick={() => nextStep(AuthStep.ENTER_EMAIL)}
          >
            <ArrowLeft className="" />
          </Button>

          <h1 className="text-2xl font-semibold tracking-tight">
            Bem vindo de volta!
          </h1>
          <p className="text-sm text-muted-foreground">
            A sporTickets agradece a preferência
          </p>
        </div>

        <div className="">
          <Input
            type="email"
            placeholder="E-mail"
            className={cn("w-full", errors.email && "border-red-500")}
            value={email}
            error={errors.email?.message}
            readOnly
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Senha"
            className={cn("w-full", errors.password && "border-red-500")}
            {...register("password")}
            error={errors.password?.message}
            password
          />
        </div>
        <div>
          <Link
            href="/esqueceu-senha"
            className="text-cyan-700 font-medium underline"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button
          className={cn(
            "w-full h-12 text-base font-normal justify-center px-4"
          )}
          type="submit"
          disabled={isSubmitting}
        >
          Continuar
          <ArrowRight className="ml-1 text-cyan-400" />
        </Button>
      </div>
    </form>
  );
};
export default StepEnterPassword;
