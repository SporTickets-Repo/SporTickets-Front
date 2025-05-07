"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { CouponDialog } from "@/components/pages/checkout/coupon-dialog";
import { EventHeader } from "@/components/pages/checkout/event-header";
import { PaymentMethodDialog } from "@/components/pages/checkout/payment-method-dialog";

import { PaymentMethodDisplay } from "@/components/pages/checkout/payment-method-display";
import { PlayerForm } from "@/components/pages/checkout/player-form/index";
import { PlayersEmptyList } from "@/components/pages/checkout/players-empty-list";
import { PlayersList } from "@/components/pages/checkout/players-list";
import { TicketCard } from "@/components/pages/checkout/ticket-card";
import { useEvent } from "@/context/event";
import type { Player, TicketForm } from "@/interface/tickets";
import { formatMoneyBR } from "@/utils/formatMoney";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function PaymentPage() {
  const { selectedTickets, submitCheckout, event, isHydrated } = useEvent();

  const router = useRouter();

  const [currentTicket, setCurrentTicket] = useState<TicketForm | null>(null);
  const [playerFormOpen, setPlayerFormOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!selectedTickets || selectedTickets.length === 0) {
      router.push(event?.slug ? `/evento/${event?.slug}` : "/");
    } else {
      setCurrentTicket((prev) => {
        return (
          selectedTickets.find((ticket) => ticket.id === prev?.id) ||
          selectedTickets[0]
        );
      });
    }
  }, [isHydrated, selectedTickets]);

  const handleSelectTicket = (ticket: TicketForm) => {
    setCurrentTicket(ticket);
  };

  const handleSelectPlayer = (player: Player) => {
    setEditingPlayer(player);
  };

  useEffect(() => {
    if (editingPlayer) {
      setPlayerFormOpen(true);
    }
  }, [editingPlayer]);

  const total =
    selectedTickets?.reduce((acc, ticket) => {
      const teamSize = ticket.ticketType.teamSize;
      const price = Number.parseFloat(ticket.ticketLot.price);
      return acc + price * teamSize;
    }, 0) || 0;

  const totalDiscount =
    selectedTickets?.reduce((acc, ticket) => {
      const teamSize = ticket.ticketType.teamSize;
      const price = Number.parseFloat(ticket.ticketLot.price);
      const teamPrice = price * teamSize;

      if (ticket.coupon?.id) {
        const discountAmount = teamPrice * ticket.coupon.percentage;
        return acc + (teamPrice - discountAmount);
      }

      return acc + teamPrice;
    }, 0) || 0;

  const subTotal = totalDiscount;
  const feeAmount =
    event?.eventFee !== undefined ? subTotal * event.eventFee : 0;
  const finalTotal = subTotal + feeAmount;

  if (!selectedTickets || selectedTickets.length === 0 || !currentTicket) {
    return null;
  }

  const formCompleted = selectedTickets.every((ticket) => {
    const players = ticket.players || [];

    const hasAllPlayers = players.length === ticket.ticketType.teamSize;
    const hasAllPers = players.every(
      (p) =>
        (p.personalizedField?.length ?? 0) ===
        ticket.ticketType.personalizedFields.length
    );

    const needsCategories =
      ticket.ticketType.categories.length > 0 &&
      players.some((p) => !p.category?.id);

    const hasPayment = !!ticket.paymentData?.paymentMethod;

    return hasAllPlayers && hasAllPers && !needsCategories && hasPayment;
  });

  const handleSubmitCheckout = async () => {
    try {
      setSubmitting(true);
      await submitCheckout();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen container-sm">
      <div className="flex items-center space-x-4 mt-2 mb-4 ">
        <Button
          variant="tertiary"
          className="rounded-full"
          size="icon"
          onClick={() =>
            router.push(event?.slug ? `/evento/${event?.slug}` : "/")
          }
        >
          <ChevronLeft size={16} className="text-zinc-500" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Checkout</h1>
          <p className="text-sm text-muted-foreground">
            Preencha os dados para finalizar a compra
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col-reverse md:flex-row gap-10 py-10 md:py-0">
        <div className="space-y-2 w-full md:w-1/2 md:order-2">
          <EventHeader />

          <div className="p-3 bg-zinc-50 rounded-lg">
            <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
            {selectedTickets?.map((ticket, key) => (
              <TicketCard
                key={key}
                ticket={ticket}
                isSelected={currentTicket?.id === ticket.id}
                onSelect={handleSelectTicket}
              />
            ))}
          </div>

          <div className="p-3 bg-zinc-50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-zinc-800/80">Desconto</p>
              <Button
                variant="outline"
                size="outline"
                onClick={() => setCouponDialogOpen(true)}
              >
                {currentTicket?.coupon?.id ? (
                  <div>
                    <span className="text-sporticket-green-700">
                      -{currentTicket?.coupon.percentage * 100}%
                    </span>{" "}
                    {currentTicket?.coupon.name.toUpperCase()}
                  </div>
                ) : (
                  "Adicionar Cupom"
                )}
                <ChevronRight size={16} className="text-zinc-800/80" />
              </Button>
            </div>
            <hr className="border-zinc-300" />
            <div className="flex justify-between items-center">
              <p className="text-zinc-800/80">Pagamento</p>
              <Button
                variant="outline"
                size="outline"
                onClick={() => setPaymentMethodDialogOpen(true)}
              >
                {currentTicket?.paymentData?.paymentMethod ? (
                  <PaymentMethodDisplay
                    key={currentTicket?.paymentData?.paymentMethod}
                    paymentData={currentTicket.paymentData}
                  />
                ) : (
                  "Selecionar opção"
                )}
                <ChevronRight size={16} className="text-zinc-800/80" />
              </Button>
            </div>
            <hr className="border-zinc-300" />
            {event?.eventFee !== undefined ? (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-zinc-800/80">Subtotal</p>
                  {currentTicket?.coupon?.id ? (
                    <div className="flex items-center gap-3">
                      <div className="text-zinc-400 text-xs line-through">
                        {formatMoneyBR(total)}
                      </div>
                      <div className="text-sporticket-green-700 font-semibold">
                        {formatMoneyBR(totalDiscount)}
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-800 font-semibold">
                      {formatMoneyBR(total)}
                    </p>
                  )}
                </div>

                <hr className="border-zinc-300" />

                <div className="flex justify-between items-center">
                  <p className="text-zinc-800/80">Taxa da plataforma</p>
                  <p className="text-sporticket-green-700 font-semibold">
                    {feeAmount === 0 ? "Gratuito" : formatMoneyBR(feeAmount)}
                  </p>
                </div>

                <hr className="border-zinc-300" />

                <div className="flex justify-between items-center pt-4">
                  <p className="text-zinc-800 font-semibold text-2xl">Total</p>
                  <p className="text-zinc-800 font-semibold text-2xl">
                    {formatMoneyBR(finalTotal)}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-zinc-800/80">Total</p>
                {currentTicket?.coupon?.id ? (
                  <div className="flex items-center gap-3">
                    <div className="text-zinc-400 text-xs line-through">
                      {formatMoneyBR(total)}
                    </div>
                    <div className="text-sporticket-green-700 font-semibold">
                      {formatMoneyBR(totalDiscount)}
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-800 font-semibold">
                    {formatMoneyBR(total)}
                  </p>
                )}
              </div>
            )}

            {!formCompleted && (
              <div className="mt-4 mb-2 p-3 border border-amber-300 bg-amber-50 rounded-lg">
                <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                  <FiAlertTriangle />
                  Complete as informações abaixo para finalizar
                </h3>
                <ul className="space-y-1 text-sm text-amber-700 pl-7 list-disc">
                  {selectedTickets.map((ticket, index) => {
                    const players = ticket.players || [];
                    const needsPlayers =
                      players.length < ticket.ticketType.teamSize;
                    const needsPersonalFields = players.some(
                      (player) =>
                        player.personalizedField?.length <
                        ticket.ticketType.personalizedFields?.length
                    );

                    const needsCategories =
                      ticket.ticketType.categories.length > 0 &&
                      players.some((player) => !player.category?.id);

                    return (
                      <React.Fragment key={index}>
                        {needsPlayers && (
                          <li>
                            Adicione{" "}
                            {ticket.ticketType.teamSize - players.length}{" "}
                            {ticket.ticketType.teamSize - players.length === 1
                              ? "jogador"
                              : "jogadores"}{" "}
                            para o ingresso {ticket.ticketType.name}
                          </li>
                        )}
                        {needsPersonalFields && (
                          <li>
                            Complete os dados pessoais de todos os jogadores
                          </li>
                        )}
                        {needsCategories && (
                          <li>Selecione a categoria para todos os jogadores</li>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {selectedTickets.some(
                    (ticket) => !ticket.paymentData?.paymentMethod
                  ) && <li>Selecione um método de pagamento</li>}
                </ul>
              </div>
            )}

            <div>
              <Button
                onClick={handleSubmitCheckout}
                variant="destructive"
                className="w-full mt-10"
                disabled={!formCompleted || submitting}
              >
                {submitting ? (
                  <>
                    Processando...
                    <ArrowRight
                      size={16}
                      className="text-white ml-2 animate-spin"
                    />
                  </>
                ) : (
                  <>
                    Realizar inscrição
                    <ArrowRight size={16} className="text-white ml-2" />
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground mt-4">
                Ao comprar você concorda com nossos{" "}
                <a href="#" className="underline">
                  Termos de Uso
                </a>
                ,{" "}
                <a href="#" className="underline">
                  Política de Privacidade
                </a>{" "}
                e{" "}
                <a href="#" className="underline">
                  Termos de Compra
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 md:order-1">
          {currentTicket?.players?.length === 0 ? (
            <PlayersEmptyList onAddPlayer={() => setPlayerFormOpen(true)} />
          ) : (
            <PlayersList
              players={currentTicket?.players}
              onSelectPlayer={handleSelectPlayer}
              onAddPlayer={() => setPlayerFormOpen(true)}
              currentTicket={currentTicket}
            />
          )}
        </div>
      </div>

      <PlayerForm
        open={playerFormOpen}
        onClose={() => {
          setPlayerFormOpen(false);
          setEditingPlayer(null);
        }}
        currentTicket={currentTicket}
        player={editingPlayer}
      />

      <CouponDialog
        open={couponDialogOpen}
        onClose={() => setCouponDialogOpen(false)}
        eventId={currentTicket?.ticketType?.eventId}
      />

      <PaymentMethodDialog
        open={paymentMethodDialogOpen}
        onClose={() => setPaymentMethodDialogOpen(false)}
      />
    </div>
  );
}
