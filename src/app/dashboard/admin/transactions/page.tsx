
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Eye,
  X,
  Receipt,
  CalendarDays,
  Hash,
  Store,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type PaymentStatus = "Paid" | "Pending" | "Failed";

interface Vendor {
  name: string;
  businessName: string;
  email: string;
  image: string;
}

interface Transaction {
  id: string;
  vendorId: string;
  vendor: Vendor | null;
  plan: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId: string;
  stripeSubscriptionId: string;
  createdAt: string | null;
}

interface TransactionStats {
  totalTransactions: number;
  paidTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
}

interface TransactionsResponse {
  success: boolean;
  stats: TransactionStats;
  totalFiltered: number;
  transactions: Transaction[];
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    Paid: "bg-green-50 text-green-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-600",
  };

  const Icon =
    status === "Paid"
      ? CheckCircle2
      : status === "Pending"
        ? Clock
        : XCircle;

  const label = status === "Paid" ? "Success" : status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      <Icon size={13} />
      {label}
    </span>
  );
}

const formatDate = (date: string | null) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    paidTransactions: 0,
    failedTransactions: 0,
    pendingTransactions: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const response: TransactionsResponse = await apiFetch(
          "/api/admin/transactions"
        );

        setTransactions(response.transactions || []);
        setStats(response.stats);
      } catch (err) {
        console.error("Fetch transactions error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load transactions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Client-side filtering of the transactions already returned by the API.
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const term = search.toLowerCase();

      const vendorName =
        transaction.vendor?.businessName ||
        transaction.vendor?.name ||
        "Unknown Vendor";

      const email = transaction.vendor?.email || "";

      const matchesSearch =
        vendorName.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term) ||
        transaction.id.toLowerCase().includes(term) ||
        transaction.stripeSessionId.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" ||
        transaction.status === statusFilter;

      const matchesPlan =
        planFilter === "All" ||
        transaction.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [transactions, search, statusFilter, planFilter]);

  // Calculate revenue from successfully paid transactions.
  const successfulTransactions = transactions.filter(
    (transaction) => transaction.status === "Paid"
  );

  const totalRevenue = successfulTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const statsCards = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      description: "From successful payments",
      icon: DollarSign,
      style: "bg-secondary text-primary",
    },
    {
      title: "Successful Payments",
      value: stats.paidTransactions,
      description: "Completed transactions",
      icon: CheckCircle2,
      style: "bg-green-50 text-green-600",
    },
    {
      title: "Pending Payments",
      value: stats.pendingTransactions,
      description: "Awaiting confirmation",
      icon: Clock,
      style: "bg-amber-50 text-amber-600",
    },
    {
      title: "Failed Payments",
      value: stats.failedTransactions,
      description: "Unsuccessful transactions",
      icon: XCircle,
      style: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Heading */}
      <div>
        <p className="mb-2 text-sm font-medium text-primary">
          Administration
        </p>

        <h1 className="font-heading text-3xl font-bold text-foreground">
          Transactions
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Monitor vendor subscriptions and track platform payments.
        </p>
      </div>

      {/* Revenue banner */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-[#34302F] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <TrendingUp size={17} />
            Platform Revenue
          </div>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            ${totalRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Total revenue from successful payments.
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
          <DollarSign size={28} />
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-border bg-white p-5"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.style}`}
              >
                <Icon size={21} />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {stat.title}
              </p>

              <h3 className="mt-1 text-2xl font-bold text-foreground">
                {loading ? "..." : stat.value}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendor or transaction ID..."
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Paid">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="All">All Plans</option>
            <option value="Premium">Premium</option>
            <option value="Free">Free</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredTransactions.length}
            </span>{" "}
            of {transactions.length} transactions
          </p>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setPlanFilter("All");
            }}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </section>

      {/* Transactions table */}
      <section className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-semibold text-foreground">
              All Transactions
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Payment records from vendor subscriptions.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Receipt size={16} />
            Read only records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-medium">Transaction</th>
                <th className="px-5 py-4 font-medium">Vendor</th>
                <th className="px-5 py-4 font-medium">Plan</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">
                  Details
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Loader2
                      size={30}
                      className="mx-auto animate-spin text-primary"
                    />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Loading transactions...
                    </p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <XCircle
                      size={35}
                      className="mx-auto text-red-500"
                    />
                    <h3 className="mt-3 font-semibold text-foreground">
                      Failed to load transactions
                    </h3>
                    <p className="mt-1 text-sm text-red-500">
                      {error}
                    </p>
                  </td>
                </tr>
              ) : (
                <>
                  {filteredTransactions.map((transaction) => {
                    const vendorName =
                      transaction.vendor?.businessName ||
                      transaction.vendor?.name ||
                      "Unknown Vendor";

                    const vendorEmail =
                      transaction.vendor?.email || "No email available";

                    return (
                      <tr
                        key={transaction.id}
                        className="transition hover:bg-muted/40"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-foreground">
                            {transaction.id}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Stripe Checkout
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-foreground">
                            {vendorName}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {vendorEmail}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                            {transaction.plan}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-semibold text-foreground">
                          {formatAmount(
                            transaction.amount,
                            transaction.currency
                          )}
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={transaction.status} />
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() =>
                              setSelectedTransaction(transaction)
                            }
                            className="rounded-lg border border-border p-2 text-muted-foreground transition hover:border-primary hover:text-primary"
                            title="View transaction details"
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <Receipt
                          size={38}
                          className="mx-auto text-muted-foreground/50"
                        />
                        <h3 className="mt-3 font-semibold text-foreground">
                          No transactions found
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Try changing your search or filters.
                        </p>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transaction details modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Receipt size={21} />
                </div>

                <div>
                  <h2 className="font-semibold text-foreground">
                    Transaction Details
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Payment information
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-muted p-5 text-center">
              <p className="text-sm text-muted-foreground">
                Transaction Amount
              </p>

              <h3 className="mt-2 text-3xl font-bold text-foreground">
                {formatAmount(
                  selectedTransaction.amount,
                  selectedTransaction.currency
                )}
              </h3>

              <div className="mt-3">
                <StatusBadge status={selectedTransaction.status} />
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Hash size={16} /> Transaction ID
                </span>
                <span className="max-w-[180px] truncate font-medium text-foreground">
                  {selectedTransaction.id}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Store size={16} /> Vendor
                </span>
                <span className="font-medium text-foreground">
                  {selectedTransaction.vendor?.businessName ||
                    selectedTransaction.vendor?.name ||
                    "Unknown Vendor"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">
                  {selectedTransaction.vendor?.email || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Subscription</span>
                <span className="font-medium text-foreground">
                  {selectedTransaction.plan}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays size={16} /> Payment Date
                </span>
                <span className="font-medium text-foreground">
                  {formatDate(selectedTransaction.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard size={16} /> Payment Method
                </span>
                <span className="font-medium text-foreground">
                  Stripe Checkout
                </span>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  Stripe Session ID
                </p>
                <p className="mt-1 break-all font-mono text-xs text-foreground">
                  {selectedTransaction.stripeSessionId || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Stripe Subscription ID
                </p>
                <p className="mt-1 break-all font-mono text-xs text-foreground">
                  {selectedTransaction.stripeSubscriptionId || "N/A"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTransaction(null)}
              className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
