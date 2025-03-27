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

import { useCreateEventContext } from "@/context/create-event";
import { EventLevel, EventStatus, EventType } from "@/interface/event";
import {
  CreateEventFormValues,
  createEventFormValuesSchema,
} from "@/schemas/createEventSchema";
import { eventService } from "@/service/event";
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

interface CreateEventFormProps {
  eventId: string;
}

export function CreateEventForm({ eventId }: CreateEventFormProps) {
  const {
    event: eventData,
    eventTypes,
    eventLevels,
    setEventId,
    setSmallImagePreview,
    setBannerImagePreview,
  } = useCreateEventContext();

  const methods = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventFormValuesSchema),
    mode: "onChange",
    defaultValues: {
      event: {
        name: "",
        slug: "",
        type: "",
        level: "",
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
    },
  });

  useEffect(() => {
    if (eventData && eventTypes && eventLevels) {
      const formatDateTimeLocal = (dateString: string) => {
        const date = new Date(dateString);
        const tzOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
      };

      methods.reset({
        event: {
          name: eventData.name ?? "",
          slug: eventData.slug ?? "",
          type: eventData.type ?? EventType.GENERAL,
          level: eventData.level ?? EventLevel.GENERAL,
          startDate: eventData.startDate
            ? formatDateTimeLocal(eventData.startDate)
            : "",
          endDate: eventData.endDate
            ? formatDateTimeLocal(eventData.endDate)
            : "",
          description: eventData.description ?? "",
          additionalInfo: eventData.additionalInfo ?? "",
          cep: eventData.address?.zipCode ?? "",
          city: eventData.address?.city ?? "",
          state: eventData.address?.state ?? "",
          street: eventData.address?.street ?? "",
          addressNumber: eventData.address?.number ?? "",
          complement: eventData.address?.complement ?? "",
          neighborhood: eventData.address?.neighborhood ?? "",
          place: eventData.place ?? "",
          regulation: eventData.regulation ?? "",
          paymentMethods: eventData.paymentMethods || [],
          bannerImageFile: undefined,
          smallImageFile: undefined,
        },

        coupons: eventData.coupons
          ? eventData.coupons.map((c) => ({
              id: c.id,
              name: c.name,
              percentage: Number(c.percentage) * 100,
              quantity: c.quantity ?? 0,
              isActive: true,
            }))
          : [],
      });

      if (eventData.bannerUrl) {
        setBannerImagePreview(eventData.bannerUrl);
      }
      if (eventData.smallImageUrl) {
        setSmallImagePreview(eventData.smallImageUrl);
      }
    }
  }, [eventData, eventTypes, eventLevels, methods]);

  useEffect(() => {
    if (eventId) {
      setEventId(eventId);
    }
  }, [eventId, setEventId]);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [tabErrors, setTabErrors] = useState<TabType[]>([]);

  const tabOrder: TabType[] = ["info", "tickets", "coupons", "collaborators"];

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

  const handleGoBack = () => router.push("/perfil");
  const handleNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex + 1 < tabOrder.length) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };
  const handlePreviousTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex - 1 >= 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  function onSubmit(data: CreateEventFormValues) {
    console.log("Form submit data:", data);
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

  const handlePublishEvent = async () => {
    try {
      await eventService.setEventStatus(eventId, EventStatus.PROGRESS);

      console.log("Event published successfully!");
    } catch (error) {
      console.error("Failed to publish event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await eventService.setEventStatus(eventId, EventStatus.CANCELLED);
      console.log("Event canceled/deleted successfully!");

      router.push("/perfil");
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <div className="container max-w-7xl pb-10">
      <div className="flex items-center space-x-4 mt-2 mb-4">
        <Button
          variant="tertiary"
          className="rounded-full p-4"
          size="icon"
          onClick={handleGoBack}
        >
          <ChevronLeft size={20} className="text-zinc-500" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Configuração do evento</h1>
        </div>
      </div>
      <Card className="p-6 space-y-6 h-full">
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

            <Button
              type="button"
              className="w-full"
              onClick={handlePublishEvent}
            >
              Publicar evento
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={handleDeleteEvent}
            >
              Apagar evento
            </Button>
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

                <div className="flex justify-end gap-4 px-4 sm:px-6">
                  {activeTab !== "info" && (
                    <Button
                      variant="default-inverse"
                      size="sm"
                      className="text-sm p-5"
                      type="button"
                      onClick={handlePreviousTab}
                    >
                      Anterior
                    </Button>
                  )}
                  {activeTab !== "collaborators" && (
                    <Button
                      type="button"
                      size="sm"
                      variant="default-inverse"
                      className="text-sm p-5"
                      onClick={handleNextTab}
                    >
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
