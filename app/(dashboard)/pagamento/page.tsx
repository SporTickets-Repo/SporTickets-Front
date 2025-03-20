"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CouponDialog } from "@/components/pages/checkout/coupon-dialog";
import { EventHeader } from "@/components/pages/checkout/event-header";
import { PaymentMethodDialog } from "@/components/pages/checkout/payment-method-dialog";
import { PlayerForm } from "@/components/pages/checkout/player-form";
import { PlayersEmptyList } from "@/components/pages/checkout/players-empty-list";
import { PlayersList } from "@/components/pages/checkout/players-list";
import { TicketCard } from "@/components/pages/checkout/ticket-card";
import { useEvent } from "@/context/event";
import { Player, TicketProps } from "@/interface/tickets";
import { formatMoneyBR } from "@/utils/formatMoney";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { selectedTickets, setSelectedTickets } = useEvent();
  const router = useRouter();

  if (selectedTickets.length === 0) {
    router.back();
  }

  const [currentTicket, setCurrentTicket] = useState<TicketProps>(
    selectedTickets[0]
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleSelectTicket = (ticket: TicketProps) => {
    setCurrentTicket(ticket);
  };

  const total = selectedTickets.reduce((acc, ticket) => {
    return acc + parseFloat(ticket.ticketLot.price);
  }, 0);

  console.log(selectedTickets);

  const [playerFormOpen, setPlayerFormOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const handleApplyCoupon = (couponId: string) => {
    console.log(couponId);
  };

  const handleAddPlayer = (player: Player) => {
    console.log(player);
  };

  return (
    <div className="min-h-screen container">
      <div className="flex items-center space-x-4 mt-2 mb-4 ">
        <Button
          variant="tertiary"
          className="rounded-full"
          size="icon"
          onClick={handleGoBack}
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
          {currentTicket.players.length === 0 ? (
            <PlayersEmptyList onAddPlayer={() => setPlayerFormOpen(true)} />
          ) : (
            <PlayersList
              players={currentTicket.players}
              selectedPlayers={currentTicket.players}
              onSelectPlayer={(player) => setEditingPlayer(player)}
              onAddPlayer={() => setPlayerFormOpen(true)}
            />
          )}
        </div>

        <div className="space-y-2">
          <EventHeader />

          <div className="p-3 bg-zinc-50 rounded-lg">
            <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
            {selectedTickets.map((ticket, key) => (
              <TicketCard
                key={key}
                ticket={ticket}
                isSelected={currentTicket.id === ticket.id}
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
                {"Adicionar Cupom"}
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
              <p className="text-zinc-800 font-semibold">
                {formatMoneyBR(total)}
              </p>
            </div>
            <div className="">
              <Button variant="destructive" className="w-full mt-10">
                Realizar inscrição
                <ArrowRight size={16} className="text-white" />
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
        player={editingPlayer ? editingPlayer : undefined}
      />

      <CouponDialog
        open={couponDialogOpen}
        onClose={() => setCouponDialogOpen(false)}
        onApply={handleApplyCoupon}
      />

      <PaymentMethodDialog
        open={paymentMethodDialogOpen}
        onClose={() => setPaymentMethodDialogOpen(false)}
        onSelect={(method) => console.log(method)}
      />
    </div>
  );
}
