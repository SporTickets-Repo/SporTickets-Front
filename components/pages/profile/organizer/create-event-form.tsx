"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ClipboardList,
  Ticket,
  TicketPercent,
  Users2,
} from "lucide-react";

import {
  CreateEventFormValues,
  createEventFormValuesSchema,
} from "@/schemas/createEventSchema";
import router from "next/router";
import { CollaboratorsTab } from "./create-form-tabs/collaborators-tab";
import { CouponsTab } from "./create-form-tabs/coupons-tab";
import { InfoTab } from "./create-form-tabs/info-tab";
import { TicketsTab } from "./create-form-tabs/tickets-tab";

type TabType = "info" | "tickets" | "coupons" | "collaborators";

export function CreateEventForm() {
  const methods = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventFormValuesSchema),
    defaultValues: {
      event: {
        name: "",
        slug: "",
        type: "",
        startDate: "",
        endDate: "",
        description: "",
        additionalInfo: "",
        cep: "",
        place: "",
        regulation: "",
        bannerImageFile: "",
        smallImageFile: "",
      },
      ticketTypes: [],
      collaborators: [],
    },
  });

  const handleGoBack = () => {
    router.back();
  };

  const [activeTab, setActiveTab] = useState<TabType>("info");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "info":
        return <InfoTab />;
      case "tickets":
        return <TicketsTab />;
      case "coupons":
        return <CouponsTab />;
      case "collaborators":
        return <CollaboratorsTab />;
      default:
        return null;
    }
  };

  function onSubmit(data: CreateEventFormValues) {
    console.log("Event Data:", data);
  }

  const onError = (errors: any) => {
    console.log("Validation errors:", errors);
  };

  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="flex items-center space-x-4 mt-2 mb-4">
        <Button
          variant="tertiary"
          className="rounded-full"
          size="icon"
          onClick={handleGoBack}
        >
          <ChevronLeft size={16} className="text-zinc-500" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Configuração do evento</h1>
          <p className="text-sm text-muted-foreground"></p>
        </div>
      </div>
      <Card className="p-6 space-y-6 min-h-[80vh]">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 space-y-2">
            <nav className="space-y-2">
              <Button
                variant={activeTab === "info" ? "orange-inverse" : "ghost"}
                className="w-full justify-start gap-2 h-10"
                onClick={() => setActiveTab("info")}
              >
                <ClipboardList className="w-4 h-4" />
                Informações
              </Button>
              <Button
                variant={activeTab === "tickets" ? "orange-inverse" : "ghost"}
                className="w-full justify-start gap-2 h-10"
                onClick={() => setActiveTab("tickets")}
              >
                <Ticket className="w-4 h-4" />
                Ingressos
              </Button>
              <Button
                variant={activeTab === "coupons" ? "orange-inverse" : "ghost"}
                className="w-full justify-start gap-2 h-10"
                onClick={() => setActiveTab("coupons")}
              >
                <TicketPercent className="w-4 h-4" />
                Cupons
              </Button>
              <Button
                variant={
                  activeTab === "collaborators" ? "orange-inverse" : "ghost"
                }
                className="w-full justify-start gap-2 h-10"
                onClick={() => setActiveTab("collaborators")}
              >
                <Users2 className="w-4 h-4" />
                Colaboradores
              </Button>
            </nav>
          </div>

          <div className="hidden md:block px-6">
            <Separator orientation="vertical" className="h-full" />
          </div>
          <div className="md:hidden my-6">
            <Separator orientation="horizontal" />
          </div>

          <div className="w-full md:w-3/4">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit, onError)}
                className="space-y-6"
              >
                {renderActiveTab()}
                {activeTab === "collaborators" && (
                  <div className="flex justify-end gap-4">
                    <Button type="submit">Criar evento</Button>
                  </div>
                )}
              </form>
            </FormProvider>
          </div>
        </div>
      </Card>
    </div>
  );
}
