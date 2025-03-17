import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OrganizerProfile() {
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
          <p>Eventos</p>
        </TabsContent>
        <TabsContent value="metrics">
          <p>Métricas</p>
        </TabsContent>
        <TabsContent value="tickets">
          <p>Ingressos</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
