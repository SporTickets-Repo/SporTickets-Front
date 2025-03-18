"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

interface PaymentMethod {
  id: string;
  type: "pix" | "card";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
}

interface PaymentMethodDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodDialog({
  open,
  onClose,
  onSelect,
}: PaymentMethodDialogProps) {
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pix",
      type: "pix",
      title: "PIX",
      icon: (
        <div className="w-8 h-8 bg-teal-100 rounded-md flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.03 6.35L5.62 7.76C4.83 8.55 4.83 9.82 5.62 10.62L13.38 18.38C14.17 19.17 15.44 19.17 16.24 18.38L17.65 16.97C18.44 16.18 18.44 14.91 17.65 14.12L9.88 6.35C9.09 5.56 7.82 5.56 7.03 6.35Z"
              fill="#00B1A9"
            />
            <path
              d="M15.53 6.35L14.12 7.76C13.33 8.55 13.33 9.82 14.12 10.62L16.24 12.74C17.03 13.53 18.3 13.53 19.09 12.74L20.5 11.33C21.29 10.54 21.29 9.27 20.5 8.47L18.38 6.35C17.59 5.56 16.32 5.56 15.53 6.35Z"
              fill="#00B1A9"
            />
            <path
              d="M4.91 16.97L3.5 18.38C2.71 19.17 2.71 20.44 3.5 21.24L4.91 22.65C5.7 23.44 6.97 23.44 7.76 22.65L9.17 21.24C9.96 20.45 9.96 19.18 9.17 18.38L7.76 16.97C6.97 16.18 5.7 16.18 4.91 16.97Z"
              fill="#00B1A9"
            />
          </svg>
        </div>
      ),
    },
    {
      id: "card-1",
      type: "card",
      title: "Master Card *****3456",
      subtitle: "Alexis P D Carter",
      icon: (
        <div className="w-8 h-8 flex items-center justify-center">
          <svg
            width="32"
            height="24"
            viewBox="0 0 32 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="24" rx="4" fill="white" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.9573 16.5254H19.2573V7.47461H22.9573V16.5254Z"
              fill="#FF5F00"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.4823 12.0001C19.4823 10.1301 20.3323 8.47007 21.6823 7.47507C20.7823 6.72507 19.6323 6.27507 18.3823 6.27507C15.4823 6.27507 13.1323 8.85007 13.1323 12.0001C13.1323 15.1501 15.4823 17.7251 18.3823 17.7251C19.6323 17.7251 20.7823 17.2751 21.6823 16.5251C20.3323 15.5301 19.4823 13.8701 19.4823 12.0001Z"
              fill="#EB001B"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M29.0823 12.0001C29.0823 15.1501 26.7323 17.7251 23.8323 17.7251C22.5823 17.7251 21.4323 17.2751 20.5323 16.5251C21.8823 15.5301 22.7323 13.8701 22.7323 12.0001C22.7323 10.1301 21.8823 8.47007 20.5323 7.47507C21.4323 6.72507 22.5823 6.27507 23.8323 6.27507C26.7323 6.27507 29.0823 8.85007 29.0823 12.0001Z"
              fill="#F79E1B"
            />
          </svg>
        </div>
      ),
    },
  ]);

  const handleSelect = (method: PaymentMethod) => {
    onSelect(method);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center mb-4">
          <DialogTitle>Método de pagamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelect(method)}
            >
              <div className="flex items-center gap-3">
                {method.icon}
                <div>
                  <p className="font-medium">{method.title}</p>
                  {method.subtitle && (
                    <p className="text-sm text-muted-foreground">
                      {method.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
          <div className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md border flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <p className="font-medium">Novo Cartão</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
