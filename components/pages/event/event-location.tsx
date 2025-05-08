"use client";

import { Address } from "@/interface/address";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface EventLocationProps {
  address: Address;
  place: string;
}

export default function EventLocation({ address, place }: EventLocationProps) {
  const [mapsURL, setMapsURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapCoordinates = async () => {
      const query = `${address.city}, ${address.neighborhood}, ${address.state}, ${address.street}, ${address.complement}, ${address.zipCode}, Brasil`;

      try {
        const res = await fetch(
          `/api/maps/proxy?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        const location = data.results?.[0]?.geometry?.location;
        if (location) {
          const url = `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;
          setMapsURL(url);
        } else {
          throw new Error("Localização não encontrada.");
        }
      } catch (err) {
        console.error("Erro ao buscar localização no Google Maps:", err);
        setMapsURL(
          `https://maps.google.com/maps?q=${encodeURIComponent(
            query
          )}&z=15&output=embed`
        );
      }
    };

    fetchMapCoordinates();
  }, [address]);

  return (
    <div className="mb-4 overflow-hidden">
      {mapsURL && (
        <iframe
          width="100%"
          height="200"
          loading="lazy"
          className="border-0 rounded-lg bg-zinc-400"
          allowFullScreen
          src={mapsURL}
        ></iframe>
      )}

      <div
        className="flex p-3 gap-2 items-center cursor-pointer"
        onClick={() => {
          const query = `${address.street}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.zipCode}, Brasil`;
          const mapsURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            query
          )}`;
          window.open(mapsURL, "_blank");
        }}
      >
        <MapPin size={14} />
        <div className="text-xs">
          <p className="font-medium">{place}</p>
          <p className="text-gray-600">
            {address.neighborhood}, {address.complement}, {address.zipCode}
          </p>
        </div>
      </div>
    </div>
  );
}
