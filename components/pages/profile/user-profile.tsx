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
        <TabsList className="w-full justify-start">
          <TabsTrigger value="tickets">
            <TbTicket />
            Meus Ingressos
          </TabsTrigger>
          {showevents && (
            <>
              <TabsTrigger value="metrics">
                <FaRegChartBar />
                Métricas
              </TabsTrigger>
              <TabsTrigger value="events">
                <TbSoccerField />
                Eventos
              </TabsTrigger>
            </>
          )}
        </TabsList>
        <Separator className="my-2 border-gray-100 border" />
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

        <TabsContent value="tickets">
          <MyTicketsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
