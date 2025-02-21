"use client"
import { useAuthSteps, AuthStep } from '@/hooks/useAuthSteps';
import { useForm } from 'react-hook-form';
import { passwordSchema } from '@/utils/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

interface StepEnterPasswordProps {
  nextStep: (next: AuthStep) => void;
  email: string;
}

type FormData = {
  email: string;
  password: string;
};

const StepEnterPassword = ({ nextStep, email }: StepEnterPasswordProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(passwordSchema),
  });


  const onSubmit = (data: FormData) => {
    console.log("Login com:", data);
    router.push('/');
  };

  useEffect(() => {
    setValue('email', email);
  }, [email]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full  max-w-md'>
      <div className="w-full space-y-4">
        <div className="space-y-2  mb-6">
          <Button
            variant="outline"
            className={cn("p-4 mb-4")}
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
          />
        </div>
        <div>

          <Link href="/redefinir-senha" className="text-cyan-700 font-medium underline">
            Esqueci minha senha
          </Link>
        </div>

        <Button
          className={cn("w-full h-12 text-base font-normal justify-center px-4")}
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