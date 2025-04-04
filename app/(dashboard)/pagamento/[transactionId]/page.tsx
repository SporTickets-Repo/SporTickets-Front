"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TransactionAwaiting } from "@/components/pages/checkout/payment/TransactionAwaiting";
import { TransactionQRCode } from "@/components/pages/checkout/payment/TransactionQRCode";
import { TransactionRejected } from "@/components/pages/checkout/payment/TransactionRejected";
import { TransactionSuccess } from "@/components/pages/checkout/payment/TransactionSuccess";
import { TransactionSummary } from "@/components/pages/checkout/payment/TransactionSummary";
import { Transaction, TransactionStatus } from "@/interface/transaction";
import { transactionService } from "@/service/transaction";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function TransactionPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchTransaction = async (isInitial = false) => {
    try {
      if (isInitial) setInitialLoading(true);

      const res = await transactionService.getTransactionById(transactionId);
      setTransaction(res);

      if (!isInitial) {
        if (res.status === TransactionStatus.APPROVED) {
          toast.success("Pagamento aprovado com sucesso!");
        } else {
          toast.error(
            "Pagamento ainda foi não confirmado. Aguarde um instante ou entre em contato com suporte."
          );
        }
      }
    } catch (err) {
      console.error("Erro ao buscar transação", err);
      toast.error("Erro ao buscar transação. Tente novamente mais tarde.");
    } finally {
      if (isInitial) setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction(true);
  }, [transactionId]);

  useEffect(() => {
    if (
      transaction?.status === TransactionStatus.PENDING ||
      transaction?.status === TransactionStatus.IN_PROCESS ||
      transaction?.status === TransactionStatus.AUTHORIZED
    ) {
      const intervalId = setInterval(() => {
        fetchTransaction();
      }, 15000);

      return () => clearInterval(intervalId);
    }
  }, [transaction?.status]);

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-zinc-500" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-20 text-zinc-600">
        Não foi possível encontrar esta transação.
      </div>
    );
  }

  const status = transaction.status;

  const renderStatus = () => {
    if (
      status === TransactionStatus.PENDING ||
      status === TransactionStatus.IN_PROCESS ||
      status === TransactionStatus.AUTHORIZED
    ) {
      return transaction.paymentMethod === "PIX" ? (
        <TransactionQRCode
          pixQRCode={transaction.pixQRCode || ""}
          onRefresh={fetchTransaction}
        />
      ) : (
        <TransactionAwaiting onRefresh={fetchTransaction} />
      );
    }

    if (
      status === TransactionStatus.APPROVED ||
      status === TransactionStatus.REFUNDED ||
      status === TransactionStatus.CHARGED_BACK
    ) {
      return <TransactionSuccess />;
    }

    if (
      status === TransactionStatus.REJECTED ||
      status === TransactionStatus.CANCELLED ||
      status === TransactionStatus.IN_MEDIATION
    ) {
      return <TransactionRejected />;
    }

    return (
      <div className="text-sm text-center text-muted-foreground">
        Status não reconhecido: {status}
      </div>
    );
  };

  return (
    <div className="container py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto min-h-[calc(60vh)]">
        <div className="flex justify-center items-center">{renderStatus()}</div>
        <div className="flex justify-center md:justify-start">
          <TransactionSummary transaction={transaction} />
        </div>
      </div>
    </div>
  );
}
