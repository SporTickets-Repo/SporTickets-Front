"use client";

import { Avatar } from "@/components/ui/avatar";
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
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { date: "16/01", value: 35000 },
  { date: "17/01", value: 32000 },
  { date: "18/01", value: 40000 },
  { date: "19/01", value: 35000 },
  { date: "20/01", value: 48000 },
  { date: "21/01", value: 42000 },
  { date: "22/01", value: 38000 },
];

const events = [
  {
    id: 1,
    name: "Copa dos Crapins",
    percentage: "92.2%",
    value: "R$ 3.773,50",
  },
  {
    id: 2,
    name: "Desafio dos Campeões",
    percentage: "7.8%",
    value: "R$ 440.74",
  },
  {
    id: 3,
    name: "Desafio dos Campeões",
    percentage: "7.8%",
    value: "R$ 440.74",
  },
];

const coupons = [
  { id: 1, name: "PrimultiCompra", percentage: "92.2%", quantity: 78 },
  { id: 2, name: "Crianca15", percentage: "7.8%", quantity: 23 },
  { id: 3, name: "SegundaCompra", percentage: "7.8%", quantity: 23 },
  { id: 4, name: "Crianca15", percentage: "7.8%", quantity: 23 },
];

const subscribers = [
  {
    id: 1,
    name: "Felipe",
    email: "felipe@gmail.com",
    date: "24/02/2025",
    event: "Copa dos Crapins",
    avatar: "F",
  },
  {
    id: 2,
    name: "Ana",
    email: "ana@gmail.com",
    date: "25/02/2025",
    event: "Desafio dos Campeões",
    avatar: "A",
  },
  {
    id: 3,
    name: "Carlos",
    email: "carlos@gmail.com",
    date: "26/02/2025",
    event: "Copa dos Crapins",
    avatar: "C",
  },
  {
    id: 4,
    name: "Mariana",
    email: "mariana@gmail.com",
    date: "27/02/2025",
    event: "Desafio dos Campeões",
    avatar: "M",
  },
  {
    id: 5,
    name: "João",
    email: "joao@gmail.com",
    date: "28/02/2025",
    event: "Copa dos Crapins",
    avatar: "J",
  },
  {
    id: 6,
    name: "Felipe",
    email: "felipe@gmail.com",
    date: "24/02/2025",
    event: "Copa dos Crapins",
    avatar: "F",
  },
  {
    id: 7,
    name: "Ana",
    email: "ana@gmail.com",
    date: "25/02/2025",
    event: "Desafio dos Campeões",
    avatar: "A",
  },
  {
    id: 8,
    name: "Carlos",
    email: "carlos@gmail.com",
    date: "26/02/2025",
    event: "Copa dos Crapins",
    avatar: "C",
  },
  {
    id: 9,
    name: "Mariana",
    email: "mariana@gmail.com",
    date: "27/02/2025",
    event: "Desafio dos Campeões",
    avatar: "M",
  },
  {
    id: 10,
    name: "João",
    email: "joao@gmail.com",
    date: "28/02/2025",
    event: "Copa dos Crapins",
    avatar: "J",
  },
];

const filters = ["Hoje", "7 Dias", "30 Dias", "90 Dias", "365 Dias"];

export function MetricDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<string>("Hoje");

  return (
    <div className="space-y-6">
      <div className="flex flex-1 justify-between items-center">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Badge
              key={filter}
              variant="filter"
              onClick={() => setSelectedFilter(filter)}
              className={cn(
                selectedFilter === filter
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {filter}
            </Badge>
          ))}
        </div>

        <Button variant="default-inverse">Filtros</Button>
      </div>
      <Card className="bg-muted p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Métricas Principais</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              15 de janeiro - 21 de janeiro
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
              <div className="text-2xl font-bold">65</div>
              <Badge variant="success">+7.25%</Badge>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-lg font-medium">
                Eventos criados
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2 p-0">
              <div className="text-2xl font-bold">2</div>
              <Badge variant="warning">-0.25%</Badge>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-lg font-medium">
                Total de cupons utilizados
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2 p-0">
              <div className="text-2xl font-bold">65</div>
              <Badge variant="success">+7.25%</Badge>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <CardDescription className="text-lg font-medium">
                Total de cupons utilizados
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2 p-0">
              <div className="text-2xl font-bold">65</div>
              <Badge variant="success">+7.25%</Badge>
            </CardContent>
          </Card>
        </div>
      </Card>

      <Card className="bg-muted">
        <CardHeader className="flex flex-row flex-1 items-center justify-between">
          <CardTitle className="text-2xl">Faturamento</CardTitle>
          <p className="text-sm text-muted-foreground">
            15 de janeiro - 21 de janeiro
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
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

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-muted/40">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Principais Eventos</CardTitle>
            <CardDescription>15 de janeiro - 21 de janeiro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {events.map((event) => (
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
                      <span>{event.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Cupons</CardTitle>
            <CardDescription>15 de janeiro - 21 de janeiro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {coupons.map((coupon) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/40">
        <CardHeader>
          <div>
            <CardTitle className="text-2xl">Inscritos</CardTitle>
            <CardDescription>Lista de inscritos nos eventos</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-auto">
          <div className="flex flex-1 flex-col gap-6">
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="flex flex-1 flex-row !items-center justify-between"
              >
                <div className="flex items-center gap-3 w-[20em]">
                  <Avatar className="h-9 w-9">
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                      {subscriber.avatar}
                    </div>
                  </Avatar>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
