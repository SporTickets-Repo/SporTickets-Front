"use client";
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthProps> = ({ password }) => {
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[@#$%^&*()_+!]/.test(password);

  return (
    <div className="space-y-2 mt-2">
      <div className={`flex items-center ${hasNumber ? "text-green-600" : "text-red-500"}`}>
        {hasNumber ? <CheckCircle size={16} /> : <XCircle size={16} />}
        <span className="ml-2 text-sm">Números</span>
      </div>

      <div className={`flex items-center ${hasSymbol ? "text-green-600" : "text-red-500"}`}>
        {hasSymbol ? <CheckCircle size={16} /> : <XCircle size={16} />}
        <span className="ml-2 text-sm">Símbolos (@#$%^&* etc.)</span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
