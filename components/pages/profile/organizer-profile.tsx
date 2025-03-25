"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/interface/event";
import { eventService } from "@/service/event";
import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { MetricDashboard } from "./metrics/metrics-dashboard";
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
        <TabsList className="w-full justify-start">
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="tickets">Ingressos</TabsTrigger>
        </TabsList>
        <Separator className="my-4" />
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
          <p>Ingressos</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
