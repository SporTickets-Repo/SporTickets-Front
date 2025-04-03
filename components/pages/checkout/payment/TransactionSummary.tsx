import { Transaction } from "@/interface/transaction";
import { translatePaymentStatus } from "@/utils/eventTranslations";
import { formatMoneyBR } from "@/utils/formatMoney";

interface Props {
  transaction: Transaction;
}

export function TransactionSummary({ transaction }: Props) {
  const total = Number(transaction.totalValue);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4 border">
      <h2 className="text-xl font-semibold text-zinc-800">Resumo da Compra</h2>

      <div className="space-y-2 text-sm text-zinc-700">
        <p>
          <span className="font-medium">Status:</span>{" "}
          <span className="capitalize">
            {translatePaymentStatus(transaction.status)}
          </span>
        </p>
        <p>
          <span className="font-medium">Método de Pagamento:</span>{" "}
          {transaction.paymentMethod}
        </p>
        {transaction.paidAt && (
          <p>
            <span className="font-medium">Pago em:</span>{" "}
            {new Date(transaction.paidAt).toLocaleString("pt-BR")}
          </p>
        )}
        <p>
          <span className="font-medium">Valor Total:</span>{" "}
          {formatMoneyBR(total)}
        </p>
        <p>
          <span className="font-medium">Ingressos:</span>{" "}
          {transaction.tickets.length}
        </p>
        <p className="text-xs text-muted-foreground">
          ID da Transação: {transaction.id}
        </p>
      </div>
    </div>
  );
}
