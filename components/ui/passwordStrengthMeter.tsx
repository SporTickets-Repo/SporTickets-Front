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
  const conditions = [
    { test: /\d/.test(password), label: "Números" },
    { test: /[@#$%^&*()_+!]/.test(password), label: "Símbolos (@#$%^&* etc.)" },
    { test: /[A-Z]/.test(password), label: "Letras maiúsculas" },
    {
      test: password?.length > 0 && /[a-z]/.test(password),
      label: "Letras minúsculas",
    },
    { test: password?.length >= 8, label: "Mínimo de 8 caracteres" },
  ];

  const strength = useMemo(() => {
    return conditions.filter((condition) => condition.test).length;
  }, [password]);

  return (
    <div className="space-y-2 mt-2">
      <div className="flex space-x-2 mb-2">
        <Progress value={strength > 1 ? 100 : 0} className="flex-1" />
        <Progress value={strength > 3 ? 100 : 0} className="flex-1" />
        <Progress value={strength > 4 ? 100 : 0} className="flex-1" />
      </div>
      {conditions.map((condition, index) => (
        <div
          key={index}
          className={`flex items-center ${
            condition.test ? "text-green-600" : "text-red-500"
          }`}
        >
          {condition.test ? <CheckCircle size={16} /> : <XCircle size={16} />}
          <span className="ml-2 text-sm">{condition.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordStrengthMeter;
