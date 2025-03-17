import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@radix-ui/react-separator";

export function UserProfile() {
  return (
    <div className="mt-10">
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="tickets">Ingressos</TabsTrigger>
        </TabsList>
        <Separator className="my-4" />
        <TabsContent value="tickets">
          <p>Ingressos</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
