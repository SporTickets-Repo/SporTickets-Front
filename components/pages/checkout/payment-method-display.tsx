import { PaymentData } from "@/interface/tickets";
import { CreditCard } from "lucide-react";
import Image from "next/image";
import { FaPix } from "react-icons/fa6";

interface PaymentMethodDisplayProps {
  paymentData: PaymentData;
}

export function PaymentMethodDisplay({
  paymentData,
}: PaymentMethodDisplayProps) {
  if (!paymentData) {
    return null;
  }

  // Mask the card number to show only the last 4 digits
  const maskCardNumber = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    const lastFourDigits = cleanNumber.slice(-4);
    return `•••• ${lastFourDigits}`;
  };

  if (paymentData.paymentMethod === "PIX") {
    return (
      <div className="flex items-center gap-2">
        <FaPix className="w-4 h-4 text-primary" />
        <span>PIX</span>
      </div>
    );
  }

  if (paymentData.paymentMethod === "CREDIT_CARD" && paymentData.cardData) {
    return (
      <div className="flex items-center gap-2">
        {paymentData.cardData.cardBrand ? (
          <Image
            src={`/assets/icons/${paymentData.cardData.cardBrand}.svg`}
            alt={paymentData.cardData.cardBrand}
            width={24}
            height={16}
          />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        <span>{maskCardNumber(paymentData.cardData.cardNumber)}</span>
      </div>
    );
  }

  return <span>{paymentData.paymentMethod}</span>;
}
