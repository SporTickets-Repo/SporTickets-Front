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
import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MyTicket } from "@/interface/myTickets";
import { ticketService } from "@/service/ticket";
import { formatMoneyBR } from "@/utils/formatMoney";
import { BiFilterAlt } from "react-icons/bi";
import { EventFilterDialog } from "./filter-dialog";
import { MetricDashboardSkeleton } from "./skeleton-metric";
import { TicketsTable } from "./tickets-table";

// Filtros de data (adicionei "Todos" para representar sem filtro)
const dateFilters = [
  "Todos",
  "Hoje",
  "7 Dias",
  "30 Dias",
  "90 Dias",
  "365 Dias",
];

interface MetricDashboardProps {
  userId: string;
}

export function MetricDashboardMaster({ userId }: MetricDashboardProps) {
  const [tickets, setTickets] = useState<MyTicket[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("Todos");
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Buscar tickets na API
  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        const data = await ticketService.allTicketsByUser(userId);
        setTickets(data);
        const eventsIds = Array.from(
          new Set(data.map((ticket) => ticket.ticketLot.ticketType.event.id))
        );
        setSelectedEvents(eventsIds);
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

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

    if (selectedEvents.length > 0) {
      filtered = filtered.filter((ticket) =>
        selectedEvents.includes(ticket.ticketLot.ticketType.event.id)
      );
    }

    return filtered;
  }, [tickets, selectedDateFilter, selectedEvents]);

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
        hour: "2-digit",
        minute: "2-digit",
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

  if (loading) {
    return <MetricDashboardSkeleton />;
  }

  return (
    <div className="space-y-2">
      {/* Filtros de data e botão de filtro por evento */}
      <div className="flex flex-1 justify-start md:justify-between md:items-center md:flex-row flex-col gap-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {dateFilters.map((filter) => (
            <Badge
              key={filter}
              variant="filter"
              onClick={() => setSelectedDateFilter(filter)}
              className={cn(
                selectedDateFilter === filter
                  ? "text-primary bg-sporticket-purple-100"
                  : "text-muted-foreground"
              )}
            >
              {filter}
            </Badge>
          ))}
        </div>
        <Button
          variant="outline"
          className="bg-neutral-200 px-5 py-1 h-10 [&_svg]:size-5 text-gray-700 font-semibold rounded-sm"
          onClick={() => setShowEventModal(true)}
        >
          Filtros <BiFilterAlt />
        </Button>
      </div>

      {/* Cartão com as métricas principais */}
      <Card className="bg-sporticket-offWhite shadow-none border-0 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-600">
            Métricas Principais
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {selectedDateFilter === "Todos"
                ? "Todos os períodos"
                : `Período: ${selectedDateFilter}`}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Card className="p-4 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-sm font-medium">
                Total de ingressos vendidos
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2 p-0">
              <div className="text-2xl font-medium text-gray-700">
                {totalTicketsSold || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-sm font-medium">
                Eventos criados
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2 p-0">
              <div className="text-2xl font-medium text-gray-700">
                {totalEventsCreated || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-sm font-medium">
                Total de cupons utilizados
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2 p-0">
              <div className="text-2xl font-medium text-gray-700">
                {totalCouponsUsed || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-sm font-medium">
                Faturamento (R$)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2 p-0">
              <div className="text-2xl font-medium text-gray-700">
                {formatMoneyBR(totalRevenue)}
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>

      {/* Cartão com gráfico de faturamento */}
      <Card className="bg-sporticket-offWhite shadow-none border-0">
        <CardHeader className="flex flex-row flex-1 items-center justify-between py-3">
          <CardTitle className="text-xl text-gray-600">Faturamento</CardTitle>
          <p className="text-sm text-muted-foreground text-light">
            {selectedDateFilter === "Todos"
              ? "Todos os períodos"
              : `Período: ${selectedDateFilter}`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#9ca3af" }}
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    `R$ ${value.toLocaleString("pt-BR")}`
                  }
                  tickLine={{ stroke: "#9ca3af" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#9661F1"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip
                  formatter={(value) => [
                    `R$ ${Number(value).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`,
                    "Faturamento",
                  ]}
                  labelFormatter={(label) => `Data: ${label}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#9661F1"
                  fill="rgba(150, 97, 241, 0.2)"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    stroke: "#7c3aed",
                    strokeWidth: 2,
                    fill: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
        <Card className="bg-sporticket-offWhite shadow-none border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-gray-600">
              Principais Eventos
            </CardTitle>
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
                        <span>{formatMoneyBR(event.revenue)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Sem dados
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sporticket-offWhite shadow-none border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-gray-600">Cupons</CardTitle>
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
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Sem dados
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TicketsTable tickets={filteredTickets} />

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
