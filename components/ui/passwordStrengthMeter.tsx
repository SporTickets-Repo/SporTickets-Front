"use client";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import React, { useMemo } from "react";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthProps> = ({
  password,
}) => {
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[@#$%^&*()_+!]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isLongEnough = password?.length >= 8;

  const strength = useMemo(() => {
    let score = 0;
    if (hasNumber) score += 1;
    if (hasSymbol) score += 1;
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (isLongEnough) score += 1;
    return score;
  }, [password]);

  return (
    <div className="space-y-2 mt-2">
      <div className="flex space-x-2 mb-2">
        <Progress value={strength > 1 ? 100 : 0} className="flex-1" />
        <Progress value={strength > 3 ? 100 : 0} className="flex-1" />
        <Progress value={strength > 4 ? 100 : 0} className="flex-1" />
      </div>
      <div
        className={`flex items-center ${
          hasNumber ? "text-green-600" : "text-red-500"
        }`}
      >
        {hasNumber ? <CheckCircle size={16} /> : <XCircle size={16} />}
        <span className="ml-2 text-sm">Números</span>
      </div>

      <div
        className={`flex items-center ${
          hasSymbol ? "text-green-600" : "text-red-500"
        }`}
      >
        {hasSymbol ? <CheckCircle size={16} /> : <XCircle size={16} />}
        <span className="ml-2 text-sm">Símbolos (@#$%^&* etc.)</span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
