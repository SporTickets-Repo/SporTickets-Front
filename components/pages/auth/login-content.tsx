"use client";
import StepEnterEmail from "@/components/StepEnterEmail";
import StepEnterPassword from "@/components/StepEnterPassword";
import StepLogin from "@/components/StepLogin";
import StepRegister from "@/components/StepRegister";
import { AuthStep, useAuthSteps } from "@/hooks/useAuthSteps";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginContent() {
  const { step, nextStep } = useAuthSteps();
  const [email, setEmail] = useState<string>("");

  return (
    <div className="flex flex-1 container p-8 gap-8">
      <div className="flex flex-1 flex-col items-center justify-center aling-start">
        <div className="flex flex-col">
          <Link href="/">
            <Image
              src="/assets/logos/Logo-Horizontal-para-fundo-Branco.png"
              alt="Sportickets Logo"
              className="h-12 w-auto mb-4"
              width={1500}
              height={267}
            />
          </Link>
        </div>
        {step === AuthStep.LOGIN && <StepLogin nextStep={nextStep} />}
        {step === AuthStep.ENTER_EMAIL && (
          <StepEnterEmail nextStep={nextStep} setEmail={setEmail} />
        )}
        {step === AuthStep.ENTER_PASSWORD && (
          <StepEnterPassword nextStep={nextStep} email={email} />
        )}
        {step === AuthStep.REGISTER && (
          <StepRegister nextStep={nextStep} email={email} />
        )}
      </div>
      <div className="w-7/12  items-center justify-center hidden lg:flex">
        <Image
          src="/assets/pattern/Pattern-1-fundo-Azul.png"
          alt="Login Visual"
          className="w-auto h-full object-cover rounded-xl"
          width={1500}
          height={1001}
        />
      </div>
    </div>
  );
}
