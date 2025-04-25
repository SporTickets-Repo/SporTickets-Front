"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/interface/event";
import { eventService } from "@/service/event";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import { FaRegChartBar } from "react-icons/fa";
import { TbSoccerField, TbTicket } from "react-icons/tb";
import useSWR from "swr";
import { MetricDashboard } from "./metrics/metrics-dashboard";
import { MyTicketsList } from "./my-tickets/my-tickets-list";
import { ProfileEventList } from "./organizer/profile-event-list";

export function UserProfile() {
  const [showevents, setShowEvents] = useState(false);

  const { data: events } = useSWR<Event[]>(
    "/events/my-events",
    eventService.getMyEvents,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  useEffect(() => {
    setShowEvents(!!events && events.length > 0);
  }, [events]);

  return (
    <div className="mt-10">
      <Tabs defaultValue="tickets" className="w-full">
        {/* Tornar os TabsList roláveis horizontalmente */}
        <TabsList className="w-full flex justify-start gap-2 overflow-x-auto scrollbar-hide">
          <TabsTrigger value="tickets" className="flex-shrink-0">
            <TbTicket />
            Meus Ingressos
          </TabsTrigger>
          {showevents && (
            <>
              <TabsTrigger value="metrics" className="flex-shrink-0">
                <FaRegChartBar />
                Métricas
              </TabsTrigger>
              <TabsTrigger value="events" className="flex-shrink-0">
                <TbSoccerField />
                Eventos
              </TabsTrigger>
            </>
          )}
        </TabsList>
        <Separator className="my-2 border-gray-100 border" />
        <TabsContent value="tickets">
          <MyTicketsList />
        </TabsContent>
        {showevents && (
          <>
            <TabsContent value="events">
              <ProfileEventList events={events || []} user />
            </TabsContent>
            <TabsContent value="metrics">
              <MetricDashboard />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
