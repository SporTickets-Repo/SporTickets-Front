"use client";
import { MyTicket } from "@/interface/myTickets";
import { ticketService } from "@/service/ticket";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MyTicketsCard } from "./my-ticket-card";

export function MyTicketsList() {
  const [loading, setLoading] = useState(true);
  const [myTickets, setMyTickets] = useState<MyTicket[] | null>(null);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.myTickets();

      setMyTickets(response);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-zinc-500" />
      </div>
    );
  }

  if (!myTickets) {
    return (
      <div className="text-center py-20 text-zinc-600">
        Você não possui ingressos.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid gap-2">
        {myTickets.map((ticket) => (
          <MyTicketsCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}
