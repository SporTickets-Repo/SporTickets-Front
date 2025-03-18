"use client";

import { useDebounce } from "@uidotdev/usehooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import EventCard from "@/components/pages/home/event-card";
import { DatePicker } from "@/components/ui/datePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { EventSummary } from "@/interface/event";
import { eventService } from "@/service/event";
import { Loader2 } from "lucide-react";

export default function SearchEventPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearchName = useDebounce(searchName, 500);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [events, setEvents] = useState<EventSummary[]>([]);

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      const response = await eventService.getFilteredEvents(
        debouncedSearchName,
        selectedDate?.toISOString() ?? "",
        priceRange[0],
        priceRange[1]
      );
      setEvents(response);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchName, selectedDate, priceRange]);

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

    router.replace(`${pathname}?${params.toString()}`);
    handleSearch();
  }, [
    debouncedSearchName,
    selectedDate,
    priceRange,
    router,
    pathname,
    handleSearch,
  ]);

  useEffect(() => {
    const paramName = searchParams.get("name") || "";
    if (paramName) {
      setSearchName(paramName);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="container py-8">
      <div className="mb-6 space-y-2">
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

        <div className="flex gap-4">
          <div>
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
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 justify-center items-center h-96">
          <Loader2 className="animate-spin self-center w-8 h-8 text-primary" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {events.map((event) => (
            <EventCard key={event?.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Nenhum evento encotrado</p>
      )}
    </div>
  );
}
