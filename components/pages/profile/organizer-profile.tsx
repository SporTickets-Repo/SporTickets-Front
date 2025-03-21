import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricDashboard } from "./metrics/metrics-dashboard";
import { ProfileEventList } from "./organizer/profile-event-list";

export function OrganizerProfile() {
  const events = [
    {
      title: "Copa dos Craques",
      location: "Arena Paulista",
      type: "Futebol 5x5",
    },
    {
      title: "Desafio dos Campeões",
      location: "Quadra Central",
      type: "Futebol 11",
    },
    {
      title: "Copa dos Craques",
      location: "Estádio Municipal",
      type: "Futebol 5x5",
    },
    {
      title: "Amistoso Elite",
      location: "Arena Neymar",
      type: "Futebol 11",
    },
  ];

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
          <ProfileEventList events={events} />
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
