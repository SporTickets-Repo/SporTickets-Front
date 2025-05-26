"use client";

import { useDebounce } from "@uidotdev/usehooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import EventCard from "@/components/pages/home/event-card";
import { DatePicker } from "@/components/ui/datePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { EventSummary } from "@/interface/event";
import { eventService } from "@/service/event";

import useHome from "@/app/[locale]/(home)/useHome";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { translateEventType } from "@/utils/eventTranslations";

async function swrFetcher([, name, startDate, minPrice, maxPrice, type]: [
  string,
  string,
  string,
  number,
  number,
  string
]) {
  return eventService.getFilteredEvents(
    name,
    startDate,
    minPrice,
    maxPrice,
    type
  );
}

export default function SearchEventPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramName = searchParams.get("name") || "";
  const [searchName, setSearchName] = useState(paramName);
  const [searchType, setSearchType] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  const debouncedSearchName = useDebounce(searchName, 500);

  useEffect(() => {
    const paramType = searchParams.get("type") || "";
    const paramMinPrice = searchParams.get("minPrice") || "";
    const paramMaxPrice = searchParams.get("maxPrice") || "";

    setSearchType(paramType);

    if (paramMinPrice || paramMaxPrice) {
      setPriceRange([
        paramMinPrice ? Number(paramMinPrice) : 0,
        paramMaxPrice ? Number(paramMaxPrice) : 0,
      ]);
    }
  }, [searchParams]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (debouncedSearchName.trim() !== "") {
      params.set("name", debouncedSearchName);
    }
    if (selectedDate) {
      params.set("startDate", selectedDate.toISOString());
    }
    if (priceRange[0] !== 0 || priceRange[1] !== 0) {
      params.set("minPrice", String(priceRange[0]));
      params.set("maxPrice", String(priceRange[1]));
    }
    if (searchType) {
      params.set("type", searchType);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    debouncedSearchName,
    selectedDate,
    priceRange,
    searchType,
    router,
    pathname,
  ]);

  useEffect(() => {
    applyFilters();
  }, [debouncedSearchName, selectedDate, priceRange, searchType, applyFilters]);

  const swrKey = useMemo(() => {
    const paramName = searchParams.get("name") || "";
    const paramType = searchParams.get("type") || "";
    const paramStartDate = searchParams.get("startDate") || "";
    const paramMinPrice = Number(searchParams.get("minPrice") || "0");
    const paramMaxPrice = Number(searchParams.get("maxPrice") || "0");

    return [
      "filteredEvents",
      paramName,
      paramStartDate,
      paramMinPrice,
      paramMaxPrice,
      paramType,
    ];
  }, [searchParams]);

  const {
    data: events,
    error,
    isLoading,
  } = useSWR<EventSummary[]>(swrKey, swrFetcher);

  const { eventTypes } = useHome();

  return (
    <div className="container py-8">
      <div className="mb-6 space-y-4">
        <div>
          <Label htmlFor="name" className="block font-semibold mb-2">
            Nome do Evento
          </Label>
          <Input
            id="name"
            placeholder="Digite o nome do evento"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="bg-neutral-50"
          />
        </div>

        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex flex-col">
            <DatePicker date={selectedDate} setDate={setSelectedDate} />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(undefined)}
                className="text-sm text-primary-500"
              >
                Limpar data
              </button>
            )}
          </div>

          <div>
            <Select
              value={searchType}
              onValueChange={(val) => {
                setSearchType(val);
              }}
            >
              <SelectTrigger className="bg-neutral-50 w-[200px]">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {translateEventType(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 justify-center items-center h-96">
          <Loader2 className="animate-spin self-center w-8 h-8 text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          Ocorreu um erro ao buscar eventos.
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Nenhum evento encontrado</p>
      )}
    </div>
  );
}
