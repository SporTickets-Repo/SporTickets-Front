"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { CollaboratorsTab } from "./create-form-tabs/collaborators-tab";
import { CouponsTab } from "./create-form-tabs/coupons-tab";
import { InfoTab } from "./create-form-tabs/info-tab";
import { TicketsTab } from "./create-form-tabs/tickets-tab";

type TabType = "info" | "tickets" | "coupons" | "collaborators";

const tabLabels = {
  info: "Informações",
  tickets: "Ingressos",
  coupons: "Cupons",
  collaborators: "Colaboradores",
};

export function CreateEventForm() {
  const methods = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventFormValuesSchema),
    mode: "onChange",
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
        city: "",
        state: "",
        street: "",
        addressNumber: "",
        complement: "",
        neighborhood: "",
        place: "",
        regulation: "",
        bannerImageFile: undefined,
        smallImageFile: undefined,
      },
      ticketTypes: [],
      collaborators: [],
    },
  });

  const router = useRouter();

  const handleGoBack = () => {
    router.push("/perfil");
  };

  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [tabErrors, setTabErrors] = useState<TabType[]>([]);

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

  const tabOrder: TabType[] = ["info", "tickets", "coupons", "collaborators"];
  const handleNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const nextIndex = currentIndex + 1;
    if (nextIndex < tabOrder.length) {
      setActiveTab(tabOrder[nextIndex]);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  function onSubmit(data: CreateEventFormValues) {
    setTabErrors([]);
    console.log("Event Data:", data);
  }

  const getTabErrors = (errors: any): TabType[] => {
    const tabsWithErrors: TabType[] = [];

    if (errors.event) tabsWithErrors.push("info");
    if (errors.ticketTypes) tabsWithErrors.push("tickets");
    if (errors.coupons) tabsWithErrors.push("coupons");
    if (errors.collaborators) tabsWithErrors.push("collaborators");

    return tabsWithErrors;
  };

  const onError = (errors: any) => {
    console.log("Validation errors:", errors);
    setTabErrors(getTabErrors(errors));
  };

  return (
    <div className="container max-w-7xl pb-10">
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
        </div>
      </div>
      <Card className="p-6 space-y-6 h-full ">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 space-y-2 ">
            <nav className="space-y-2">
              {tabOrder.map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "orange-inverse" : "ghost"}
                  className="w-full justify-start gap-2 h-10"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "info" && <ClipboardList className="w-4 h-4" />}
                  {tab === "tickets" && <Ticket className="w-4 h-4" />}
                  {tab === "coupons" && <TicketPercent className="w-4 h-4" />}
                  {tab === "collaborators" && <Users2 className="w-4 h-4" />}
                  {tabLabels[tab]}
                </Button>
              ))}
            </nav>
            <Separator orientation="horizontal" className="w-full" />

            <div className="my-5 flex flex-col items-center gap-4">
              {tabErrors.length > 0 && (
                <div className="text-red-500 text-sm text-center">
                  {tabErrors.map((tab) => (
                    <p key={tab}>Aba de {tabLabels[tab]} incompleta.</p>
                  ))}
                </div>
              )}
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
                  <Button type="submit">Criar evento</Button>
                </form>
              </FormProvider>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden md:block px-6" />
          <Separator orientation="horizontal" className="md:hidden my-6" />

          <div className="w-full md:w-3/4">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit, onError)}
                className="space-y-6"
              >
                {renderActiveTab()}
                <div className="flex justify-end">
                  {activeTab !== "collaborators" && (
                    <Button type="button" onClick={handleNextTab}>
                      Próximo
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </Card>
    </div>
  );
}
