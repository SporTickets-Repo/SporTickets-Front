import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@radix-ui/react-separator";

export function CreateEventForm() {
  return (
    <div>
      <Tabs
        defaultValue="information"
        orientation="vertical"
        className="w-full flex flex-row"
      >
        <TabsList className="flex flex-col h-full items-start ">
          <TabsTrigger value="information">Informações</TabsTrigger>
          <TabsTrigger value="tickets">Ingressos</TabsTrigger>
          <TabsTrigger value="coupons">Cupons</TabsTrigger>
          <TabsTrigger value="subscriber">Inscritos</TabsTrigger>
          <TabsTrigger value="partners">Colaboradores</TabsTrigger>
        </TabsList>
        <Separator className="" orientation="vertical" />
        <TabsContent value="information">
          <div>
            <p>Informações</p>
          </div>
        </TabsContent>
        <TabsContent value="tickets">
          <p>Ingressos</p>
        </TabsContent>
        <TabsContent value="coupons">
          <p>Cupons</p>
        </TabsContent>
        <TabsContent value="subscriber">
          <p>Inscritos</p>
        </TabsContent>
        <TabsContent value="partners">
          <p>Colaboradores</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
