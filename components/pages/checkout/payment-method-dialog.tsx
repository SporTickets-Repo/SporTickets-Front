"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEvent } from "@/context/event";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { FaCreditCard, FaPix } from "react-icons/fa6";
import { CardFormDialog } from "./card-form-dialog";

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
}

export function PaymentMethodDialog({
  open,
  onClose,
}: PaymentMethodDialogProps) {
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "PIX",
      type: "pix",
      title: "PIX",
      icon: <FaPix className="text-xl text-primary" title="PIX" />,
    },
    {
      id: "CREDIT_CARD",
      type: "card",
      title: "Cartão de crédito",
      subtitle: "Master, Visa, Elo, etc.",
      icon: (
        <FaCreditCard className="text-xl text-primary" title="Master Card" />
      ),
    },
  ]);

  const { setSelectedTickets } = useEvent();

  const [showCardForm, setShowCardForm] = useState(false);

  const handleSelect = (method: PaymentMethod) => {
    if (method.type === "card") {
      setShowCardForm(true);
      return;
    }
    if (method.type === "pix") {
      setSelectedTickets((prev) => {
        return prev.map((ticket) => {
          return {
            ...ticket,
            paymentData: { paymentMethod: method.id },
          };
        });
      });
      onClose();
      return;
    }
    return;
  };

  const handleCardFormClose = () => {
    setShowCardForm(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open && !showCardForm} onOpenChange={onClose}>
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
          </div>
        </DialogContent>
      </Dialog>

      <CardFormDialog open={showCardForm} onClose={handleCardFormClose} />
    </>
  );
}
