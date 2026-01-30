"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { getTransactionHistory } from "@/store/slices/accountSlice";
import { Card } from "@/components/ui/Card";
import { formatDate, formatTokenAmount } from "@/utils/format";

export default function TransactionsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, transactions } = useSelector(
    (state: RootState) => state.account,
  );

  useEffect(() => {
    if (status?.publicKey) {
      dispatch(getTransactionHistory(status.publicKey));
    }
  }, [dispatch, status?.publicKey]);

  const getStatusColor = (successful: boolean) => {
    return successful ? "text-green-600" : "text-red-600";
  };

  const getOperationType = (type: string) => {
    switch (type) {
      case "create_account":
        return "Funding";
      case "payment":
        return "Payment";
      case "trust":
        return "Trust";
      default:
        return type.replace("_", " ").toUpperCase();
    }
  };

  if (transactions.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
        <div className="text-center">Loading transactions...</div>
      </div>
    );
  }

  if (transactions.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
        <div className="text-red-600">Error: {transactions.error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

      {transactions.transactions.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-8">
            No transactions found.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactions.transactions.map((tx) => (
            <Card key={tx.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">
                    Transaction {tx.hash.slice(0, 8)}...
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(tx.created_at)}
                  </p>
                </div>
                <div
                  className={`font-semibold ${getStatusColor(tx.successful)}`}
                >
                  {tx.successful ? "Confirmed" : "Failed"}
                </div>
              </div>

              <div className="space-y-2">
                {tx.operations.map((op) => (
                  <div
                    key={op.id}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <span className="font-medium">
                        {getOperationType(op.type)}
                      </span>
                      {op.amount && (
                        <span className="ml-2 text-sm">
                          {formatTokenAmount(op.amount)} {op.asset || "XLM"}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {op.to && `To: ${op.to.slice(0, 8)}...`}
                      {op.from && `From: ${op.from.slice(0, 8)}...`}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Fee: {formatTokenAmount(tx.fee_charged)} XLM | Ledger:{" "}
                {tx.ledger}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
