"use client"
import { useState } from 'react';

export enum AuthStep {
  LOGIN = 'LOGIN',
  ENTER_EMAIL = 'ENTER_EMAIL',
  ENTER_PASSWORD = 'ENTER_PASSWORD',
  REGISTER = 'REGISTER',
  VERIFY = 'VERIFY',
}

export function useAuthSteps() {
  const [step, setStep] = useState<AuthStep>(AuthStep.LOGIN);
  const nextStep = (next: AuthStep) => {
    setStep(next)
  }
  return { step, nextStep };
}