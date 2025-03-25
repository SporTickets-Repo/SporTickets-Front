import { useEvent } from "@/context/event";
import { formatDateWithoutYear, formatHour } from "@/utils/dateTime";
import Image from "next/image";

export function EventHeader() {
  const { event } = useEvent();
  if (!event) return null;
  return (
    <div className="bg-zinc-50 p-3 rounded-lg flex items-center gap-4">
      <Image
        src={event.bannerUrl || ""}
        alt={event.name}
        unoptimized
        width={100}
        height={100}
        className="w-20 h-20 rounded-lg object-cover bg-gray-200"
      />
      <div>
        <h2 className="font-semibold text-sm">{event.name}</h2>
        <p className="text-sm text-sporticket-green-500 font-bold">
          {formatDateWithoutYear(event.startDate)} •{" "}
          {formatHour(event.startDate)}
        </p>
        <p className="text-sm text-muted-foreground">
          {event.place}, {event.address.bairro}
        </p>
        <p className="text-sm text-sporticket-green-500">7 vagas restantes</p>
      </div>
    </div>
  );
}
