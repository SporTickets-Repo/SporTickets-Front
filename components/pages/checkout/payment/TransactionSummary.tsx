import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { Transaction } from "@/interface/transaction";
import { formatMoneyBR } from "@/utils/formatMoney";

interface Props {
  transaction: Transaction;
  lang: Locale;
}

export async function TransactionSummary({ transaction, lang }: Props) {
  const total = Number(transaction.totalValue);
  const dictionary = await getDictionary(lang);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4 border">
      <h2 className="text-xl font-semibold text-zinc-800">
        {dictionary.transactionSummary?.title || "Resumo da Compra"}
      </h2>

      <div className="space-y-2 text-sm text-zinc-700">
        <p>
          <span className="font-medium">{dictionary.status}:</span>{" "}
          <span className="capitalize">
            {dictionary.paymentStatus[transaction.status]}
          </span>
        </p>
        <p>
          <span className="font-medium">
            {dictionary.transactionSummary?.paymentMethod ||
              "Método de Pagamento"}
            :
          </span>{" "}
          {
            dictionary.paymentMethod[
              transaction.paymentMethod as keyof typeof dictionary.paymentMethod
            ]
          }
        </p>
        {transaction.paidAt && (
          <p>
            <span className="font-medium">
              {dictionary.transactionSummary?.paidAt || "Pago em"}:
            </span>{" "}
            {new Date(transaction.paidAt).toLocaleString(
              lang === "en" ? "en-US" : "pt-BR"
            )}
          </p>
        )}
        <p>
          <span className="font-medium">
            {dictionary.transactionSummary?.total || "Valor Total"}:
          </span>{" "}
          {formatMoneyBR(total)}
        </p>
        <p>
          <span className="font-medium">
            {dictionary.transactionSummary?.tickets || "Ingressos"}:
          </span>{" "}
          {transaction.tickets.length}
        </p>
        <p className="text-xs text-muted-foreground">
          {dictionary.transactionSummary?.transactionId || "ID da Transação"}:{" "}
          {transaction.id}
        </p>
      </div>
    </div>
  );
}
