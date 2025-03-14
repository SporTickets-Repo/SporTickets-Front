import Image from "next/image";

export default function EventHeader() {
  return (
    <div className="overflow-hidden rounded-lg">
      <Image
        src="/placeholder.svg?height=200&width=800"
        alt="3ª ETAPA - Campeonato Paulista de Esportes de Areia"
        width={800}
        height={200}
        className="h-auto w-full object-cover"
        priority
      />
    </div>
  );
}
