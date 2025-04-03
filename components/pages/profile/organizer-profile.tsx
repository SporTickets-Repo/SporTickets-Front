"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/interface/event";
import { eventService } from "@/service/event";
import { Loader2 } from "lucide-react";
import { FaRegChartBar } from "react-icons/fa";
import { TbSoccerField, TbTicket } from "react-icons/tb";
import useSWR from "swr";
import { MetricDashboard } from "./metrics/metrics-dashboard";
import { MyTicketsList } from "./my-tickets/my-tickets-list";
import { ProfileEventList } from "./organizer/profile-event-list";

export function OrganizerProfile() {
  const {
    data: events,
    error,
    isLoading,
  } = useSWR<Event[]>("/events/my-events", eventService.getMyEvents, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  if (error) {
    return (
      <div className="mt-10 text-center text-destructive">
        Erro ao carregar os eventos.
      </div>
    );
  }

  return (
    <div className="mt-10">
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="w-full justify-start flex flex-wrap gap-2 md:gap-4">
          <TabsTrigger
            value="events"
            className="flex items-center gap-2 text-sm md:text-base"
          >
            <TbSoccerField className="w-5 h-5 md:w-6 md:h-6" />
            <span>Eventos</span>
          </TabsTrigger>
          <TabsTrigger
            value="metrics"
            className="flex items-center gap-2 text-sm md:text-base"
          >
            <FaRegChartBar className="w-5 h-5 md:w-6 md:h-6" />
            <span>Métricas</span>
          </TabsTrigger>
          <TabsTrigger
            value="tickets"
            className="flex items-center gap-2 text-sm md:text-base"
          >
            <TbTicket className="w-5 h-5 md:w-6 md:h-6" />
            <span>Meus Ingressos</span>
          </TabsTrigger>
        </TabsList>
        <Separator className="my-4 border-sporticket-gray" />
        <TabsContent value="events">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
          ) : (
            <ProfileEventList events={events || []} />
          )}
        </TabsContent>
        <TabsContent value="metrics">
          <MetricDashboard />
        </TabsContent>
        <TabsContent value="tickets">
          <MyTicketsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
