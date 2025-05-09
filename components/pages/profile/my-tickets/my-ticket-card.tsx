"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MyTicket } from "@/interface/myTickets";
import { formatDateWithoutYear } from "@/utils/dateTime";
import Image from "next/image";
import { useState } from "react";
import { TicketModal } from "./ticket-modal";

interface MyTicketsCardProps {
  ticket: MyTicket;
}

export function MyTicketsCard({ ticket }: MyTicketsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const event = ticket.ticketLot.ticketType.event;

  return (
    <>
      <Card
        className="mb-2 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-4 flex items-center gap-4">
          {event.smallImageUrl && (
            <Image
              src={event.smallImageUrl}
              alt={event.name}
              width={64}
              height={64}
              className="rounded-md object-cover w-16 h-16"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold">{event.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDateWithoutYear(event.startDate)} • {event.place}
            </p>
            {ticket.category && (
              <p className="text-xs text-zinc-500">
                Categoria: {ticket?.category?.title}
              </p>
            )}
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {ticket.code}
          </div>
        </CardContent>
      </Card>

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={ticket}
      />
    </>
  );
}
