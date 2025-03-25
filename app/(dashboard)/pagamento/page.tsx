"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { CouponDialog } from "@/components/pages/checkout/coupon-dialog";
import { EventHeader } from "@/components/pages/checkout/event-header";
import { PaymentMethodDialog } from "@/components/pages/checkout/payment-method-dialog";

import { PlayerForm } from "@/components/pages/checkout/player-form/index";
import { PlayersEmptyList } from "@/components/pages/checkout/players-empty-list";
import { PlayersList } from "@/components/pages/checkout/players-list";
import { TicketCard } from "@/components/pages/checkout/ticket-card";
import { useEvent } from "@/context/event";
import { Player, TicketProps } from "@/interface/tickets";
import { formatMoneyBR } from "@/utils/formatMoney";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function PaymentPage() {
  const { selectedTickets } = useEvent();
  const router = useRouter();

  const [currentTicket, setCurrentTicket] = useState<TicketProps | null>(null);
  const [playerFormOpen, setPlayerFormOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (!selectedTickets || selectedTickets.length === 0) {
      router.push("/");
    } else {
      setCurrentTicket((prev) => {
        return (
          selectedTickets.find((ticket) => ticket.id === prev?.id) ||
          selectedTickets[0]
        );
      });
    }
  }, [selectedTickets]);

  const handleSelectTicket = (ticket: TicketProps) => {
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
      return acc + parseFloat(ticket.ticketLot.price);
    }, 0) || 0;

  const totalDiscount =
    selectedTickets?.reduce((acc, ticket) => {
      if (ticket.coupon?.id) {
        return (
          acc +
          parseFloat(ticket.ticketLot.price) -
          ticket.coupon.percentage * parseFloat(ticket.ticketLot.price)
        );
      }
      return acc;
    }, 0) || 0;

  if (!selectedTickets || selectedTickets.length === 0 || !currentTicket) {
    return null;
  }

  return (
    <div className="min-h-screen container px-24">
      <div className="flex items-center space-x-4 mt-2 mb-4 ">
        <Button
          variant="tertiary"
          className="rounded-full"
          size="icon"
          onClick={() => router.push("/")}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="w-full">
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

        <div className="space-y-2">
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
                {"Selecionar opção"}
                <ChevronRight size={16} className="text-zinc-800/80" />
              </Button>
            </div>
            <hr className="border-zinc-300" />
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
            <div>
              <Button variant="destructive" className="w-full mt-10">
                Realizar inscrição
                <ArrowRight size={16} className="text-white ml-2" />
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
        onSelect={(method) => console.log(method)}
      />
    </div>
  );
}
