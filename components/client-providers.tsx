// components/ClientProviders.tsx
"use client";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth";
import { EventProvider } from "@/context/event";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <EventProvider>
          {children}
          <Toaster />
        </EventProvider>
      </AuthProvider>
    </Elements>
  );
}
