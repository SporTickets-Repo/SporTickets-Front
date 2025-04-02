"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { MyTicket } from "@/interface/myTickets";
import { ticketService } from "@/service/ticket";
import { EventFilterDialog } from "./filter-dialog";

// Filtros de data (adicionei "Todos" para representar sem filtro)
const dateFilters = [
  "Todos",
  "Hoje",
  "7 Dias",
  "30 Dias",
  "90 Dias",
  "365 Dias",
];

export function MetricDashboard() {
  const [tickets, setTickets] = useState<MyTicket[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("Todos");
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  // Buscar tickets na API
  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await ticketService.allTickets();
        setTickets(data);
        // Seleciona por padrão todos os eventos disponíveis
        const eventsIds = Array.from(
          new Set(data.map((ticket) => ticket.ticketLot.ticketType.event.id))
        );
        setSelectedEvents(eventsIds);
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
        setTickets([]);
      }
    }
    fetchTickets();
  }, []);

  // Filtra os tickets de acordo com o filtro de data e eventos selecionados
  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    // Filtragem por data
    if (selectedDateFilter !== "Todos") {
      const now = new Date();
      let startDate: Date;
      if (selectedDateFilter === "Hoje") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else {
        const days = parseInt(selectedDateFilter.split(" ")[0]);
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - days + 1
        );
      }
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.createdAt);
        return ticketDate >= startDate && ticketDate <= now;
      });
    }

    // Filtragem por evento
    if (selectedEvents.length > 0) {
      filtered = filtered.filter((ticket) =>
        selectedEvents.includes(ticket.ticketLot.ticketType.event.id)
      );
    }

    return filtered;
  }, [tickets, selectedDateFilter, selectedEvents]);

  // Cálculo das métricas principais
  const totalTicketsSold = filteredTickets.length;
  const totalRevenue = filteredTickets.reduce(
    (sum, ticket) => sum + parseFloat(ticket.price),
    0
  );
  const totalCouponsUsed = filteredTickets.filter(
    (ticket) => ticket.coupon !== null
  ).length;
  const distinctEvents = Array.from(
    new Set(
      filteredTickets.map((ticket) => ticket.ticketLot.ticketType.event.id)
    )
  );
  const totalEventsCreated = distinctEvents.length;

  // Agrupamento para o gráfico de faturamento (por data – formato dd/MM)
  const revenueChartData = useMemo(() => {
    const grouped: { [key: string]: number } = {};
    filteredTickets.forEach((ticket) => {
      const date = new Date(ticket.createdAt);
      const formatted = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      grouped[formatted] = (grouped[formatted] || 0) + parseFloat(ticket.price);
    });
    return Object.entries(grouped).map(([date, value]) => ({ date, value }));
  }, [filteredTickets]);

  // Agrupamento para "Principais Eventos"
  const eventsData = useMemo(() => {
    const eventMap: { [key: string]: { name: string; revenue: number } } = {};
    filteredTickets.forEach((ticket) => {
      const event = ticket.ticketLot.ticketType.event;
      if (!eventMap[event.id]) {
        eventMap[event.id] = { name: event.name, revenue: 0 };
      }
      eventMap[event.id].revenue += parseFloat(ticket.price);
    });
    const totalRev = Object.values(eventMap).reduce(
      (sum, event) => sum + event.revenue,
      0
    );
    return Object.entries(eventMap).map(([id, event]) => ({
      id,
      name: event.name,
      revenue: event.revenue,
      percentage: totalRev
        ? ((event.revenue / totalRev) * 100).toFixed(2) + "%"
        : "0%",
    }));
  }, [filteredTickets]);

  // Agrupamento para "Cupons"
  const couponsData = useMemo(() => {
    const couponMap: { [key: string]: { name: string; quantity: number } } = {};
    filteredTickets.forEach((ticket) => {
      if (ticket.coupon) {
        const name = ticket.coupon.name;
        if (!couponMap[name]) {
          couponMap[name] = { name, quantity: 0 };
        }
        couponMap[name].quantity += 1;
      }
    });
    const totalCoupons = Object.values(couponMap).reduce(
      (sum, coupon) => sum + coupon.quantity,
      0
    );
    return Object.entries(couponMap).map(([name, coupon]) => ({
      id: name,
      name,
      quantity: coupon.quantity,
      percentage: totalCoupons
        ? ((coupon.quantity / totalCoupons) * 100).toFixed(2) + "%"
        : "0%",
    }));
  }, [filteredTickets]);

  // Lista de inscritos (pode ser cada ticket – ou agrupar usuários se necessário)
  const subscribers = useMemo(() => {
    return filteredTickets.map((ticket) => ({
      id: ticket.id,
      name: ticket.user.name,
      email: ticket.user.email,
      date: new Date(ticket.createdAt).toLocaleDateString("pt-BR"),
      event: ticket.ticketLot.ticketType.event.name,
      avatar: ticket.user.profileImageUrl,
      category: ticket.category.title,
    }));
  }, [filteredTickets]);

  // Eventos disponíveis (para o modal de filtro)
  const availableEvents = useMemo(() => {
    const eventMap: { [key: string]: { id: string; name: string } } = {};
    tickets.forEach((ticket) => {
      const event = ticket.ticketLot.ticketType.event;
      eventMap[event.id] = { id: event.id, name: event.name };
    });
    return Object.values(eventMap);
  }, [tickets]);

  return (
    <div className="space-y-6">
      {/* Filtros de data e botão de filtro por evento */}
      <div className="flex flex-1 justify-between items-center">
        <div className="flex gap-2">
          {dateFilters.map((filter) => (
            <Badge
              key={filter}
              variant="filter"
              onClick={() => setSelectedDateFilter(filter)}
              className={cn(
                selectedDateFilter === filter
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {filter}
            </Badge>
          ))}
        </div>
        <Button
          variant="default-inverse"
          onClick={() => setShowEventModal(true)}
        >
          Filtros
        </Button>
      </div>

      {/* Cartão com as métricas principais */}
      <Card className="bg-muted p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Métricas Principais</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {selectedDateFilter === "Todos"
                ? "Todos os períodos"
                : `Período: ${selectedDateFilter}`}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-lg font-medium">
                Total de ingressos vendidos
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2 p-0">
              <div className="text-2xl font-bold">{totalTicketsSold || 0}</div>
              <Badge variant="success">+0%</Badge>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-lg font-medium">
                Eventos criados
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2 p-0">
              <div className="text-2xl font-bold">
                {totalEventsCreated || 0}
              </div>
              <Badge variant="warning">+0%</Badge>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-lg font-medium">
                Total de cupons utilizados
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2 p-0">
              <div className="text-2xl font-bold">{totalCouponsUsed || 0}</div>
              <Badge variant="success">+0%</Badge>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-lg font-medium">
                Faturamento (R$)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2 p-0">
              <div className="text-2xl font-bold">
                {totalRevenue.toFixed(2)}
              </div>
              <Badge variant="success">+0%</Badge>
            </CardContent>
          </Card>
        </div>
      </Card>

      {/* Cartão com gráfico de faturamento */}
      <Card className="bg-muted">
        <CardHeader className="flex flex-row flex-1 items-center justify-between">
          <CardTitle className="text-2xl">Faturamento</CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedDateFilter === "Todos"
              ? "Todos os períodos"
              : `Período: ${selectedDateFilter}`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cartões de Principais Eventos e Cupons */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-muted/40">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Principais Eventos</CardTitle>
            <CardDescription>
              {selectedDateFilter === "Todos"
                ? "Todos os períodos"
                : `Período: ${selectedDateFilter}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {eventsData.length > 0 ? (
                eventsData.map((event) => (
                  <div key={event.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{event.name}</span>
                      <span className="text-sm">{event.percentage}</span>
                    </div>
                    <div className="space-y-1">
                      <Progress
                        value={parseFloat(event.percentage.replace("%", ""))}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Faturamento</span>
                        <span>R$ {event.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sem dados</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Cupons</CardTitle>
            <CardDescription>
              {selectedDateFilter === "Todos"
                ? "Todos os períodos"
                : `Período: ${selectedDateFilter}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {couponsData.length > 0 ? (
                couponsData.map((coupon) => (
                  <div key={coupon.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{coupon.name}</span>
                      <span className="text-sm">{coupon.percentage}</span>
                    </div>
                    <div className="space-y-1">
                      <Progress
                        value={parseFloat(coupon.percentage.replace("%", ""))}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Quantidade</span>
                        <span>{coupon.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sem dados</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de inscritos */}
      <Card className="bg-muted/40">
        <CardHeader>
          <div>
            <CardTitle className="text-2xl">Inscritos</CardTitle>
            <CardDescription>Lista de inscritos nos eventos</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="max-h-[600px] overflow-auto">
          <div className="flex flex-1 flex-col gap-6">
            {subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex flex-1 flex-row !items-center justify-between"
                >
                  <div className="flex items-center gap-3 w-[20em]">
                    {/* Aqui você pode utilizar seu componente Avatar */}
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {subscriber.avatar ? (
                        <img
                          src={subscriber.avatar}
                          alt={subscriber.name}
                          className="rounded-full"
                        />
                      ) : (
                        <span>{subscriber.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium leading-none">
                        {subscriber.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {subscriber.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground w-fit">
                    {subscriber.date}
                  </div>
                  <div className="text-sm font-medium text-end w-[20em]">
                    {subscriber.event}
                  </div>
                  <div className="text-sm font-medium text-end w-[20em]">
                    {subscriber.category}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sem inscritos</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de filtro por evento */}
      <EventFilterDialog
        isOpen={showEventModal}
        onOpenChange={setShowEventModal}
        availableEvents={availableEvents}
        selectedEvents={selectedEvents}
        setSelectedEvents={setSelectedEvents}
      />
    </div>
  );
}
