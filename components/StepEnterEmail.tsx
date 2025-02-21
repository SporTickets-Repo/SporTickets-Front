"use client"
import { useAuthSteps, AuthStep } from '@/hooks/useAuthSteps';
import { set, useForm } from 'react-hook-form';
import { emailSchema, passwordSchema } from '@/utils/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';


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

  const onSubmit = (data: FormData) => {
    console.log('Email:', data);
    setEmail(data.email);
    nextStep(AuthStep.REGISTER);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-md'>
      <div className="w-full space-y-4">
        <div className="space-y-2 mb-6">
          <Button
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
          className={cn("w-full h-12 text-base font-normal justify-center px-4")}
          type='submit'
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