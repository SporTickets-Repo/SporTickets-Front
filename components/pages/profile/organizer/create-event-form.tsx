"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ArrowUpIcon,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LinkIcon,
  Loader2,
  ShieldX,
  Ticket,
  TicketPercent,
  Trash2Icon,
  Users2,
} from "lucide-react";
import { CgMathPercent } from "react-icons/cg";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth";
import { useCreateEventContext } from "@/context/create-event";
import { SendTicketProvider } from "@/context/send-ticket";
//import { EventDashboardAccess } from "@/interface/collaborator";
import { EventDashboardAccess } from "@/interface/collaborator";
import {
  EventLevel,
  EventStatus,
  EventType,
  PaymentMethod,
} from "@/interface/event";
import type { UserType } from "@/interface/tickets";
import {
  type CreateEventFormValues,
  createEventFormValuesSchema,
  eventFormValuesSchema,
} from "@/schemas/createEventSchema";
import { eventService } from "@/service/event";
import { translateEventStatusOrganizer } from "@/utils/eventTranslations";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { CollaboratorsTab } from "./create-form-tabs/collaborators-tab";
import { CouponsTab } from "./create-form-tabs/coupons-tab";
import { InfoTab } from "./create-form-tabs/info-tab";
import { IntegrationsTab } from "./create-form-tabs/integrations-tab";
import { SendTicketTab } from "./create-form-tabs/send-tickets";
import { TaxesTab } from "./create-form-tabs/taxes-tab";
import { TermsTab } from "./create-form-tabs/terms-tab";
import { TicketsTab } from "./create-form-tabs/tickets-tab";

type TabType =
  | "info"
  | "tickets"
  | "coupons"
  | "collaborators"
  | "integrations"
  | "taxes"
  | "sendTicket"
  | "terms";

const tabLabels = {
  info: "Informações",
  tickets: "Ingressos",
  coupons: "Cupons",
  collaborators: "Colaboradores",
  integrations: "Integrações",
  taxes: "Taxas",
  sendTicket: "Enviar Ingressos",
  terms: "Termos e Condições",
};

interface CreateEventFormProps {
  eventId: string;
}

const NotUserPermissionComponent = () => {
  const router = useRouter();

  return (
    <section className="container py-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Configurações do evento</h1>
        <p>Você não tem permissão para acessar essa página.</p>
        <Button variant="default" onClick={() => router.push("/perfil")}>
          Voltar para o perfil
        </Button>
      </div>
    </section>
  );
};

export function CreateEventForm({ eventId }: CreateEventFormProps) {
  const { user } = useAuth();
  const isMaster = user?.role === "MASTER";

  const { event } = useCreateEventContext();

  const collaborators: EventDashboardAccess[] =
    event?.eventDashboardAccess || [];

  const {
    event: eventData,
    eventLoading,
    eventTypes,
    eventLevels,
    setEventId,
    setSmallImagePreview,
    setBannerImagePreview,
  } = useCreateEventContext();

  const hasPermission =
    isMaster ||
    user?.id === event?.createdBy ||
    collaborators.some((collaborator) => collaborator.userId === user?.id) ||
    eventLoading;

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
        emailCustomText: "",
        cep: "",
        city: "",
        state: "",
        street: "",
        addressNumber: "",
        complement: "",
        neighborhood: "",
        place: "",
        regulation: "",
        allowIndividualTickets: false,
        allowFullTickets: false,
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
          emailCustomText: eventData.emailCustomText ?? "",
          cep: eventData.address?.zipCode ?? "",
          city: eventData.address?.city ?? "",
          state: eventData.address?.state ?? "",
          street: eventData.address?.street ?? "",
          addressNumber: eventData.address?.number ?? "",
          complement: eventData.address?.complement ?? "",
          neighborhood: eventData.address?.neighborhood ?? "",
          place: eventData.place ?? "",
          regulation: eventData.regulation ?? "",
          allowIndividualTickets: eventData.allowIndividualTickets ?? false,
          allowFullTickets: eventData.allowFullTickets ?? false,
          paymentMethods:
            eventData.paymentMethods && eventData.paymentMethods.length > 0
              ? eventData.paymentMethods
              : [PaymentMethod.PIX],
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

        ticketTypes: eventData.ticketTypes
          ? eventData.ticketTypes.map((t) => ({
              id: t.id,
              eventId: t.eventId,
              name: t.name,
              description: t.description,
              userType: t.userType as UserType,
              teamSize: t.teamSize,
              ticketLots:
                t.ticketLots?.map((lot) => ({
                  id: lot.id,
                  ticketTypeId: lot.ticketTypeId,
                  name: lot.name,
                  price: Number.parseFloat(lot.price),
                  quantity: lot.quantity,
                  startDate: lot.startDate,
                  endDate: lot.endDate,
                  isActive: lot.isActive,
                  createdAt: lot.createdAt,
                  updatedAt: lot.updatedAt,
                  deletedAt: lot.deletedAt || null,
                })) || [],
              categories:
                t.categories?.map((c) => ({
                  id: c.id,
                  ticketTypeId: c.ticketTypeId,
                  title: c.title,
                  restriction: c.restriction,
                  quantity: c.quantity,
                  deletedAt: c.deletedAt || null,
                })) || [],
              personalizedFields:
                t.personalizedFields?.map((pf) => ({
                  id: pf.id,
                  ticketTypeId: pf.ticketTypeId,
                  type: pf.type,
                  requestTitle: pf.requestTitle,
                  optionsList: pf.optionsList,
                  deletedAt: pf.deletedAt || null,
                })) || [],
            }))
          : [],

        bracket: eventData.bracket
          ? eventData.bracket.map((b) => ({
              id: b.id,
              name: b.name,
              url: b.url,
              isActive: true,
            }))
          : [],

        ranking: eventData.ranking
          ? eventData.ranking.map((r) => ({
              id: r.id,
              name: r.name,
              url: r.url,
              isActive: true,
            }))
          : [],
        eventFee: Math.round(Number(eventData.eventFee) * 100),
        terms: eventData.terms
          ? eventData.terms.map((t) => ({
              id: t.id,
              title: t.title,
              isObligatory: t.isObligatory,
              fileUrl: t.fileUrl,
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
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  const baseTabs: TabType[] = [
    "info",
    "tickets",
    "coupons",
    "collaborators",
    "integrations",
    "sendTicket",
    "terms",
  ];
  const tabOrder: TabType[] = isMaster ? [...baseTabs, "taxes"] : baseTabs;

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
      case "integrations":
        return <IntegrationsTab />;
      case "taxes":
        return <TaxesTab />;
      case "sendTicket":
        return (
          <SendTicketProvider>
            <SendTicketTab />
          </SendTicketProvider>
        );
      case "terms":
        return <TermsTab />;
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
      await eventService.setEventStatus(eventId, EventStatus.REGISTRATION);
      console.log("Event published successfully!");
      setShowPublishDialog(false);
      await mutate(`/events/${eventId}`);
    } catch (error) {
      console.error("Failed to publish event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await eventService.setEventStatus(eventId, EventStatus.CANCELLED);
      console.log("Event canceled/deleted successfully!");
      setShowDeleteDialog(false);
      await mutate(`/events/${eventId}`);
      router.push("/perfil");
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleFinishEvent = async () => {
    try {
      await eventService.setEventStatus(eventId, EventStatus.FINISHED);
      //console.log("Event finished successfully!");
      await mutate(`/events/${eventId}`);
      setShowFinishDialog(false);
    } catch (error) {
      console.error("Failed to finish event:", error);
    }
  };

  function getPublishRequirementsErrors(event: typeof eventData) {
    const errors: string[] = [];

    if (!event) return ["Dados do evento não carregados."];

    const eventCheck = eventFormValuesSchema.safeParse({
      name: event.name,
      slug: event.slug,
      type: event.type,
      level: event.level,
      startDate: event.startDate,
      endDate: event.endDate,
      description: event.description,
      additionalInfo: event.additionalInfo,
      emailCustomText: event.emailCustomText,
      cep: event.address?.zipCode,
      city: event.address?.city,
      state: event.address?.state,
      street: event.address?.street,
      addressNumber: event.address?.number,
      complement: event.address?.complement,
      neighborhood: event.address?.neighborhood,
      place: event.place,
      regulation: event.regulation,
      allowIndividualTickets: event.allowIndividualTickets,
      allowFullTickets: event.allowFullTickets,
    });

    if (!eventCheck.success) {
      errors.push(
        "Preencha todos os campos obrigatórios nas informações do evento."
      );
    }

    if (!event.ticketTypes || event.ticketTypes.length === 0) {
      errors.push("Adicione pelo menos um tipo de ingresso.");
    } else {
      const hasValidTicket = event.ticketTypes.some((ticket) => {
        // const hasValidCategory =
        // ticket.categories && ticket.categories.length > 0;
        const hasValidLot = ticket.ticketLots && ticket.ticketLots.length > 0;
        // return hasValidCategory && hasValidLot;
        return hasValidLot;
      });

      if (!hasValidTicket) {
        errors.push("Cada tipo de ingresso precisa ter ao menos um lote.");
      }
    }

    return errors;
  }

  const [publishErrors, setPublishErrors] = useState<string[]>([]);

  useEffect(() => {
    if (eventData) {
      const errors = getPublishRequirementsErrors(eventData);
      setPublishErrors(errors);
    }
  }, [eventData]);

  if (!hasPermission) {
    return <NotUserPermissionComponent />;
  }

  return (
    <div className="container-sm">
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
      <Card className="md:p-6 py-6 px-2 space-y-6 h-full">
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
                  {tab === "integrations" && <LinkIcon className="w-4 h-4" />}
                  {tab === "taxes" && <CgMathPercent className="w-4 h-4" />}
                  {tab === "sendTicket" && <ArrowUpIcon className="w-4 h-4" />}
                  {tab === "terms" && <ShieldX className="w-4 h-4" />}
                  {tabLabels[tab]}
                </Button>
              ))}
            </nav>
            <Separator orientation="horizontal" className="w-full" />

            <div className="flex flex-row flex-1 ml-2 text-center w-full rounded-xl justify-start pt-2 gap-2 items-center">
              <Label>Status:</Label>
              {eventLoading || !eventData?.status ? (
                <Loader2 className="animate-spin mr-2 h-6 w-6 self-center" />
              ) : (
                <h2 className="text-lg font-medium text-center">
                  {translateEventStatusOrganizer(
                    eventData?.status as EventStatus
                  )}
                </h2>
              )}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {eventData?.status !== EventStatus.FINISHED &&
                    eventData?.status !== EventStatus.REGISTRATION && (
                      <div className="w-full">
                        {eventData?.status === EventStatus.PROGRESS ? (
                          <Button
                            variant="select"
                            type="button"
                            className="w-full justify-start gap-2 h-10"
                            onClick={() => setShowFinishDialog(true)}
                          >
                            <ArrowUpIcon className="w-4 h-4" />
                            Finalizar evento
                          </Button>
                        ) : (
                          <>
                            {!eventLoading && eventData && (
                              <Button
                                variant={
                                  publishErrors.length > 0
                                    ? "outline"
                                    : "select"
                                }
                                type="button"
                                className={`w-full justify-start gap-2 h-10 ${
                                  publishErrors.length > 0
                                    ? "border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                                    : ""
                                }`}
                                onClick={() =>
                                  publishErrors.length === 0 &&
                                  setShowPublishDialog(true)
                                }
                                disabled={publishErrors.length > 0}
                              >
                                {publishErrors.length > 0 ? (
                                  <AlertCircle className="w-4 h-4" />
                                ) : (
                                  <ArrowUpIcon className="w-4 h-4" />
                                )}
                                {publishErrors.length > 0
                                  ? "Pendências para publicar"
                                  : "Publicar evento"}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                </TooltipTrigger>
                {publishErrors.length > 0 && (
                  <TooltipContent
                    side="right"
                    align="start"
                    className="max-w-xs p-0 overflow-hidden border border-red-200 text-black"
                  >
                    <div className="bg-red-50 p-3 border-b border-red-200">
                      <h3 className="font-semibold text-red-700 flex items-center gap-2">
                        <AlertCircle size={16} />
                        Campos obrigatórios pendentes
                      </h3>
                    </div>
                    <div className="p-3 bg-white">
                      <ul className="space-y-2">
                        {publishErrors.map((error, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <Button
              type="button"
              variant="destructive"
              className="w-full justify-start gap-2 h-10"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2Icon className="w-4 h-4" />
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
                  {tabOrder.indexOf(activeTab) > 0 && (
                    <Button
                      variant="default-inverse"
                      size="sm"
                      className="text-sm px-4 py-2items-center [&_svg]:size-5"
                      type="button"
                      onClick={handlePreviousTab}
                    >
                      <ChevronLeft />
                      Anterior
                    </Button>
                  )}
                  {tabOrder.indexOf(activeTab) < tabOrder.length - 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="default-inverse"
                      className="text-sm px-4 py-2 items-center [&_svg]:size-5"
                      onClick={handleNextTab}
                    >
                      Próximo Passo
                      <ChevronRight />
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </Card>

      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="">
          <DialogHeader className="items-center mb-4 space-y-8">
            <DialogTitle className="text-center text-xl">
              Publicar evento
            </DialogTitle>
            <DialogDescription className="text-base">
              O Evento está em{" "}
              <span className="text-sporticket-orange font-medium">
                {translateEventStatusOrganizer(
                  eventData?.status as EventStatus
                )}
              </span>
              , você realmente deseja alterar o status para{" "}
              <span className="text-sporticket-orange font-medium">
                {translateEventStatusOrganizer(EventStatus.REGISTRATION)}
              </span>
              ? <br /> <br /> Após publicado, o evento estará visível para todos
              os usuários.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handlePublishEvent}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="pt-10">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-center text-xl">
              Apagar evento
            </DialogTitle>
            <DialogDescription className="text-base">
              O Evento está em{" "}
              <span className="text-sporticket-orange font-medium">
                {translateEventStatusOrganizer(
                  eventData?.status as EventStatus
                )}
              </span>
              , você realmente deseja alterar o status para{" "}
              <span className="text-sporticket-orange font-medium">
                {translateEventStatusOrganizer(EventStatus.CANCELLED)}
              </span>
              ? <br /> Tem certeza que deseja apagar este evento? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Apagar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="pt-10">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-center text-xl">
              Finalizar evento
            </DialogTitle>
            <DialogDescription className="text-base">
              O Evento está em{" "}
              <span className="text-sporticket-orange font-medium">
                {translateEventStatusOrganizer(
                  eventData?.status as EventStatus
                )}
              </span>
              , você realmente deseja alterar o status para{" "}
              <span className="text-sporticket-orange font-medium">
                {translateEventStatusOrganizer(EventStatus.FINISHED)}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFinishDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleFinishEvent}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
