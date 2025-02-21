"use client";
import { AuthStep } from "@/hooks/useAuthSteps";
import { cn } from "@/lib/utils";
import { authService } from "@/service/auth";
import { emailSchema } from "@/utils/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(emailSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await authService.checkEmail(data.email);
      if (response) {
        nextStep(AuthStep.ENTER_PASSWORD);
        setEmail(data.email);
      } else {
        nextStep(AuthStep.REGISTER);
        setEmail(data.email);
      }
    } catch (error) {
      console.error("Failed to check email:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <div className="w-full space-y-4">
        <div className="space-y-2 mb-6">
          <Button
            type="button"
            variant="outline"
            className={cn("p-4 mb-4")}
            onClick={() => nextStep(AuthStep.LOGIN)}
          >
            <ArrowLeft className="" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Digite seu e-mail
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
            {...register("email")}
            error={errors.email?.message}
          />
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
export default StepEnterEmail;
