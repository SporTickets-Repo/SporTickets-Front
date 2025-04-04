"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MyTicket } from "@/interface/myTickets";
import { generateGoogleCalendarLink } from "@/utils/addCalendar";
import { formatDateWithoutYear, formatHour } from "@/utils/dateTime";
import { formatMoneyBR } from "@/utils/formatMoney";
import { toPng } from "html-to-image";
import { CalendarIcon, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: MyTicket;
}

export function TicketModal({ isOpen, onClose, ticket }: TicketModalProps) {
  const event = ticket.ticketLot.ticketType.event;
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleSaveImage = async () => {
    if (ticketRef.current === null) return;

    try {
      const dataUrl = await toPng(ticketRef.current);
      const link = document.createElement("a");
      link.download = `ticket-${ticket.code}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
    }
  };

  const link = generateGoogleCalendarLink({
    title: event.name,
    location: event.place,
    description: event.description,
    start: new Date(event.startDate),
    end: new Date(event.endDate),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-auto flex flex-col p-0 border-0 rounded-xl">
        <div ref={ticketRef}>
          <div className="bg-sporticket-green-300 text-white px-4 py-3 relative">
            <DialogTitle className="text-center">
              <p>Ingresso pessoal</p>
            </DialogTitle>
            <div className="text-center mt-1">
              <p className="text-sm opacity-90">{event.name}</p>
            </div>

            {/* <div className="absolute right-4 top-4">
            <Share2 size={20} />
          </div> */}
          </div>

          <div className="overflow-y-auto px-6 py-4 flex-1 bg-white">
            {ticket.code && (
              <div className="flex flex-1 justify-center mb-4">
                <QRCodeSVG value={ticket.code} size={200} />
              </div>
            )}

            <div className="w-full mb-4 relative">
              <Image
                src={event.bannerUrl}
                alt={event.name}
                width={320}
                height={150}
                className="w-full rounded-lg object-cover h-40"
              />
              <Link href={`/evento/${event.slug}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2 bg-white text-xs"
                >
                  Ir para o evento
                </Button>
              </Link>
            </div>

            <div className="w-full space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Nome</p>
                <p className="font-semibold">{ticket.user.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Evento</p>
                <p className="font-semibold">{event.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Lote</p>
                  <p className="font-medium">{ticket.ticketLot.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Valor do lote</p>
                  <p className="font-medium">
                    {formatMoneyBR(ticket.ticketLot.price)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Categoria</p>
                  <p className="font-medium">{ticket.category.title}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ingresso</p>
                  <p className="font-medium">
                    {ticket.ticketLot.ticketType.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Data</p>
                  <p className="font-medium">
                    {formatDateWithoutYear(event.startDate)} •{" "}
                    {formatHour(event.startDate)}
                  </p>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs text-purple-600 p-0 h-auto"
                    >
                      <CalendarIcon size={12} className="mr-1" />
                      Add Calendário
                    </Button>
                  </a>
                </div>

                <div>
                  <p className="text-gray-500">Local</p>
                  <p className="font-medium">{event.place}</p>
                </div>
              </div>

              {ticket.personalizedFieldAnswers?.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-500">Respostas personalizadas</p>
                  <ul className="list-disc pl-5 text-sm text-zinc-700">
                    {ticket.personalizedFieldAnswers.map((answer) => (
                      <li key={answer.id}>
                        <strong>
                          {answer.personalizedField.requestTitle}:
                        </strong>{" "}
                        {answer.answer}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 flex flex-col gap-4">
          <Button
            onClick={handleSaveImage}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-100/90"
          >
            <Download size={16} />
            Salvar como Imagem
          </Button>
        </div>

        <div className="bg-black p-3 flex justify-center ">
          <Image
            src="/assets/logos/Logo-Horizontal-negativo-Branco.png"
            alt="SportTickets"
            width={320}
            height={150}
            className="rounded-lg object-cover h-8 w-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
