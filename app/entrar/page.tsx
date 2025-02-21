"use client"
import StepEnterEmail from "@/components/StepEnterEmail";
import StepEnterPassword from "@/components/StepEnterPassword";
import StepLogin from "@/components/StepLogin";
import StepRegister from "@/components/StepRegister";
import StepVerify from "@/components/StepVerify";
import { AuthStep, useAuthSteps } from "@/hooks/useAuthSteps";
import { useState } from "react";

export default function LoginPage() {
  const { step, nextStep } = useAuthSteps();
  const [email, setEmail] = useState<string>('');

  return (
    <div className="flex px-20 pt-20">
      <div className="flex align-center justify-center flex-row flex-1">
        <div className="flex-1 flex flex-col items-center aling-start  p-8 ">
          <div className="flex flex-col">
            <img src="/assets/logos/Logo-Horizontal-para-fundo-Branco.png" alt="Sportickets Logo" className="h-12 mb-10" />
          </div>
          {step === AuthStep.LOGIN && <StepLogin nextStep={nextStep} />}
          {step === AuthStep.ENTER_EMAIL && <StepEnterEmail nextStep={nextStep} setEmail={setEmail} />}
          {step === AuthStep.ENTER_PASSWORD && <StepEnterPassword nextStep={nextStep} email={email} />}
          {step === AuthStep.REGISTER && <StepRegister nextStep={nextStep} email={email} />}
          {step === AuthStep.VERIFY && <StepVerify />}
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <div className="relative hidden md:block">
            <img src="/assets/pattern/Pattern-1-fundo-Azul.png" alt="Login Visual" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  )
}