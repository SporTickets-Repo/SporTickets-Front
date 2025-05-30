// components/StripePaymentForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  CardElement,
  CardElementProps,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Styles for the CardElement (you can customize)
const CARD_ELEMENT_OPTIONS: CardElementProps["options"] = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

export function StripePaymentForm() {
  const stripe = useStripe(); // hook para chamar ações do Stripe
  const elements = useElements(); // hook para acessar os campos gerenciados
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1) Recupera o clientSecret que o backend gerou
  useEffect(() => {
    const secret = localStorage.getItem("stripeClientSecret");
    setClientSecret(secret);
  }, []);

  // 2) Handle no submit do form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);

    // 3) Pega o card que o usuário digitou
    const card = elements.getElement(CardElement) as StripeCardElement;
    if (!card) {
      toast.error("Campo de cartão não carregado.");
      setIsProcessing(false);
      return;
    }

    // 4) Chama o Stripe para confirmar o pagamento
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card },
      }
    );

    if (error) {
      // 5a) Em caso de erro, mostra mensagem e libera o botão
      toast.error(`Erro no pagamento: ${error.message}`);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // 5b) Sucesso: redireciona para a mesma rota para disparar polling
      toast.success("Pagamento confirmado!");
      router.replace(window.location.pathname);
    } else {
      // 5c) Qualquer outro status
      toast(`Status do pagamento: ${paymentIntent?.status}`);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {/* O CardElement é o campo de cartão padrão do Stripe */}
      <CardElement options={CARD_ELEMENT_OPTIONS} />

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
      >
        {isProcessing ? "Processando…" : "Pagar com cartão"}
      </Button>
    </form>
  );
}
