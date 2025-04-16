"use client";

import { Button } from "@/components/ui/button";
import { useEvent } from "@/context/event";
import { TicketType } from "@/interface/tickets";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface RegistrationSummaryProps {
  ticketTypes: TicketType[];
}

export default function RegistrationSummary({
  ticketTypes,
}: RegistrationSummaryProps) {
  const { addTicket, removeTicket, selectedTickets } = useEvent();
  const router = useRouter();

  const getQuantity = (ticketTypeId: string) => {
    return selectedTickets.filter((t) => t.ticketType.id === ticketTypeId)
      .length;
  };

  const total = selectedTickets.reduce((acc, ticket) => {
    return (
      acc + parseFloat(ticket.ticketLot.price) * ticket.ticketType.teamSize
    );
  }, 0);

  const handleSubmit = () => {
    if (total === 0) return;
    router.push("/pagamento");
  };

  return (
    <div className="overflow-hidden mb-5">
      <div className="">
        {ticketTypes.map((ticket) => {
          const activeLot = ticket.ticketLots.find((lot) => lot.isActive);

          if (!activeLot) return null;

          const quantity = getQuantity(ticket.id);
          const individualPrice = parseFloat(activeLot.price);
          const teamPrice = individualPrice * ticket.teamSize;
          const totalTicketPrice = teamPrice * quantity;

          const availableQuantity = Math.max(
            activeLot.quantity - activeLot.soldQuantity,
            0
          );

          const isSoldOut = availableQuantity === 0;

          return (
            <div
              key={ticket.id}
              className={`flex items-center justify-between bg-zinc-100 mb-3 p-4 rounded-lg ${
                isSoldOut && "opacity-50 pointer-events-none"
              }`}
            >
              <div>
                <h3 className="font-medium">{ticket.name}</h3>
                <p className="text-xs text-gray-500">
                  {isSoldOut
                    ? "Esgotado"
                    : `Restam ${availableQuantity} vaga${
                        availableQuantity > 1 ? "s" : ""
                      }`}
                </p>
                <span className="block text-sm text-sporticket-green-700">
                  Valor por equipe ({ticket.teamSize}{" "}
                  {ticket.teamSize > 1 ? "pessoas" : "pessoa"}):{" "}
                  <strong>R$ {teamPrice.toFixed(2)}</strong>
                </span>

                <div className="flex items-center text-xs text-gray-500">
                  <span>Valor por pessoa:</span>
                  <span className="ml-1">R$ {individualPrice.toFixed(2)}</span>
                </div>
                {quantity > 0 && (
                  <span className="block text-xs mt-1 text-gray-500">
                    Total para {quantity} {quantity > 1 ? "equipes" : "equipe"}:{" "}
                    <strong>R$ {totalTicketPrice.toFixed(2)}</strong>
                  </span>
                )}
                {ticket.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ticket.categories.slice(0, 3).map((category) => (
                      <span
                        key={category.id}
                        className="text-xs bg-sporticket-orange/10 text-sporticket-orange px-2 py-0.5 rounded-full font-medium"
                      >
                        {category.title}
                      </span>
                    ))}
                    {ticket.categories.length > 3 && (
                      <span className="text-xs bg-sporticket-orange/10 text-sporticket-orange px-2 py-0.5 rounded-full font-medium">
                        +{ticket.categories.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {!isSoldOut ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Button
                      variant="select"
                      size="icon"
                      className="h-6 w-6 rounded"
                      onClick={() => removeTicket(ticket.id)}
                    >
                      <Minus />
                    </Button>
                    <p className="text-3xs w-[30px] text-center">{quantity}</p>
                    <Button
                      variant="select"
                      size="icon"
                      className="h-6 w-6 rounded"
                      onClick={() => {
                        if (quantity < availableQuantity) {
                          addTicket(ticket.id);
                        }
                      }}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              ) : (
                <span className="text-sporticket-orange font-light text-md">
                  ESGOTADO
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-3 bg-zinc-100 p-4 rounded-lg">
        <div className="mb-2 flex items-center justify-between  ">
          <span className="font-light">Total</span>
          <span className="text-lg font-bold">R$ {total.toFixed(2)}</span>
        </div>
        <Button
          className="w-full"
          variant="destructive"
          disabled={total === 0}
          onClick={handleSubmit}
        >
          Realizar Inscrição
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
