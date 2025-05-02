"use client";
import { AuthStep } from "@/hooks/useAuthSteps";
import { cn } from "@/lib/utils";
import { authService } from "@/service/auth";
import { emailSchema } from "@/utils/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface StepEnterEmailProps {
  nextStep: (next: AuthStep) => void;
  setEmail: (email: string) => void;
}

type FormData = {
  email: string;
};

const StepEnterEmail = ({ nextStep, setEmail }: StepEnterEmailProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(emailSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await authService.checkEmail(
        data.email.toLocaleLowerCase()
      );
      if (response) {
        setEmail(data.email.toLocaleLowerCase());
        nextStep(AuthStep.ENTER_PASSWORD);
      } else {
        setEmail(data.email);
        nextStep(AuthStep.REGISTER);
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        router.push(`/conta-existente?email=${encodeURIComponent(data.email)}`);
        return;
      }
      console.error("Failed to check email:", error);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <div className="w-full space-y-4">
        <div className="space-y-2 mb-6">
          <Button
            type="button"
            variant="outline"
            className={cn("py-4 mb-4 px-0")}
            onClick={() => nextStep(AuthStep.LOGIN)}
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Digite seu e-mail
          </h1>
          <p className="text-sm text-muted-foreground">
            A SporTickets agradece a preferência
          </p>
        </div>

        <Input
          type="email"
          placeholder="E-mail"
          className={cn("w-full", errors.email && "border-red-500")}
          {...register("email")}
          error={errors.email?.message}
        />

        <Button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full h-12 text-base font-normal justify-center px-4 transition-all duration-200"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin h-5 w-5 text-muted-foreground mr-2" />
              Carregando...
            </span>
          ) : (
            <span className="flex items-center">
              Continuar
              <ArrowRight className="ml-2 text-cyan-400 transition-transform" />
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default StepEnterEmail;
