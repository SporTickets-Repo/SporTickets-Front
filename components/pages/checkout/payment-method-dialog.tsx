"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEvent } from "@/context/event";
import { PaymentMethod } from "@/interface/event";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { FaCreditCard, FaPix } from "react-icons/fa6";
import { CardFormDialog } from "./card-form-dialog";

interface PaymentMethodOption {
  id: PaymentMethod;
  type: "pix" | "card" | "boleto";
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
  const { setSelectedTickets, event } = useEvent();
  const [showCardForm, setShowCardForm] = useState(false);

  const methodMap: Record<PaymentMethod, PaymentMethodOption> = {
    [PaymentMethod.PIX]: {
      id: PaymentMethod.PIX,
      type: "pix",
      title: "PIX",
      icon: <FaPix className="text-xl text-primary" title="PIX" />,
    },
    [PaymentMethod.CREDIT_CARD]: {
      id: PaymentMethod.CREDIT_CARD,
      type: "card",
      title: "Cartão de crédito",
      subtitle: "Master, Visa, Elo, etc.",
      icon: (
        <FaCreditCard className="text-xl text-primary" title="Master Card" />
      ),
    },
    [PaymentMethod.BOLETO]: {
      id: PaymentMethod.BOLETO,
      type: "boleto",
      title: "Boleto bancário",
      subtitle: "Pagamento via boleto",
      icon: <FaCreditCard className="text-xl text-primary" title="Boleto" />,
    },
  };

  const availableMethods = event?.paymentMethods ?? [];

  const visibleMethods: PaymentMethodOption[] = availableMethods
    .map((method) => methodMap[method])
    .filter(Boolean);

  const handleSelect = (method: PaymentMethodOption) => {
    if (method.type === "card") {
      setShowCardForm(true);
      return;
    }
    if (method.type === "pix") {
      setSelectedTickets((prev) =>
        prev.map((ticket) => ({
          ...ticket,
          paymentData: { paymentMethod: method.id },
        }))
      );
      onClose();
    }
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
          {visibleMethods.length > 0 ? (
            <div className="space-y-2">
              {visibleMethods.map((method) => (
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
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">
                Não há métodos de pagamento disponíveis no momento. Por favor,
                tente novamente mais tarde ou entre em contato com o suporte.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CardFormDialog open={showCardForm} onClose={handleCardFormClose} />
    </>
  );
}
