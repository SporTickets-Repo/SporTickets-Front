"use client";

import { Address } from "@/interface/address";
import { MapPin } from "lucide-react";

interface EventLocationProps {
  address: Address;
  place: string;
}

export default function EventLocation({ address, place }: EventLocationProps) {
  const mapsQuery = `${address.logradouro}, ${address.bairro}, ${address.localidade}, ${address.uf}, Brasil`;
  const mapsURL = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
    mapsQuery
  )}`;

  return (
    <div className="mb-4 overflow-hidden  ">
      <iframe
        width="100%"
        height="200"
        loading="lazy"
        className="border-0 rounded-lg"
        allowFullScreen
        src={mapsURL}
      ></iframe>

      <div className="flex p-3 gap-2 items-center">
        <MapPin size={14} />
        <div className="text-xs">
          <p className="font-medium">{place}</p>
          <p className="text-gray-600">
            {address.bairro}, {address.logradouro}, {address.cep}
          </p>
        </div>
      </div>
    </div>
  );
}
