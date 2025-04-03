"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MyTicket } from "@/interface/myTickets";
import { translatePaymentStatus } from "@/utils/eventTranslations";
import { formatMoneyBR } from "@/utils/formatMoney";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as XLSX from "xlsx";

interface TicketsTableProps {
  tickets: MyTicket[];
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  const exportToExcel = () => {
    const rows = tickets.map((ticket) => {
      const personalizedFields = ticket.personalizedFieldAnswers.reduce(
        (acc, pfa) => {
          acc[`${pfa.personalizedField.requestTitle}`] = pfa.answer;
          return acc;
        },
        {} as Record<string, string>
      );

      return {
        Usuário: `${ticket.user.name}`,
        Email: ticket.user.email,
        Categoria: ticket.category?.title || "",
        Lote: ticket.ticketLot.name,
        "Valor Pago": ticket.price,
        Evento: ticket.ticketLot.ticketType.event.name,
        "Status da Transação": ticket.transaction.status,
        "Código do Ticket": ticket.code,
        "Team Name": ticket.team.tickets.map((t) => t.user.name).join(", "),
        "Team Document": ticket.team.tickets
          .map((t) => t.user.document)
          .join(", "),
        "Team Email": ticket.team.tickets.map((t) => t.user.email).join(", "),
        ...personalizedFields,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    XLSX.writeFile(workbook, "tickets.xlsx");
  };

  return (
    <Card className="bg-sporticket-offWhite shadow-none border-0 p-0">
      <CardHeader className="flex flex-row items-center justify-between w-full">
        <div>
          <CardTitle className="text-2xl">Inscritos</CardTitle>
          <CardDescription>Lista de inscritos nos eventos</CardDescription>
        </div>
        <Button
          onClick={exportToExcel}
          variant="outline"
          className="bg-neutral-200 px-3 py-0 h-8 [&_svg]:size-5"
        >
          Exportar para Excel
          <RiFileExcel2Fill />
        </Button>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-left text-sm font-semibold text-gray-500">
              <th className="px-4 py-2">Usuário:</th>
              <th className="px-4 py-2">Evento:</th>
              <th className="px-4 py-2">Categoria:</th>
              <th className="px-4 py-2">Lote:</th>
              <th className="px-4 py-2">Status da Transação:</th>
              <th className="px-4 py-2">Valor Pago:</th>
              <th className="px-4 py-2">Código do Ticket:</th>
            </tr>
          </thead>
          <tbody className="divider-y  text-sm text-gray-700">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {ticket.user.profileImageUrl ? (
                        <img
                          src={ticket.user.profileImageUrl}
                          alt={ticket.user.name}
                          className="rounded-full"
                        />
                      ) : (
                        <span>{ticket.user.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium leading-none">
                        {ticket.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  {ticket.ticketLot.ticketType.event.name}
                </td>
                <td className="px-4 py-2 items-center">
                  {ticket.category?.title || "-"}
                </td>
                <td className="px-4 py-2">{ticket.ticketLot.name}</td>

                <td className="px-4 py-2">
                  {translatePaymentStatus(ticket.transaction.status)}
                </td>
                <td className="px-4 py-2 items-center">
                  {formatMoneyBR(ticket.price)}
                </td>
                <td className="px-4 py-2">{ticket.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
