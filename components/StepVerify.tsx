"use client"

import { useAuthSteps, AuthStep } from '@/hooks/useAuthSteps';
import { useForm } from 'react-hook-form';

const StepVerify = () => {
  const { nextStep } = useAuthSteps();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    // Verificar código
    console.log(data);
    nextStep(AuthStep.LOGIN);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('code')} placeholder="Digite o código" className="input-field" />
      <button type="submit" className="btn-primary">Verificar</button>
    </form>
  );
};
export default StepVerify;