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

export default function TransactionPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const res = await transactionService.getTransactionById(transactionId);
      setTransaction(res);
    } catch (err) {
      console.error("Erro ao buscar transação", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  if (loading) {
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
