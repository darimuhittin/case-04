export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginPayload {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string;
    lastLoginIP: string;
  };
  accessToken: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  code?: string;
  details?: Array<{ field: string; message: string }>;
  statusCode?: number;
}

export type LoginResponse = ApiResponse<LoginPayload>;

export type FinancialTrend = "up" | "down" | "flat";

export interface FinancialChange {
  percentage: number;
  trend: FinancialTrend;
}

export interface FinancialMetric {
  amount: number;
  currency: string;
  change: FinancialChange;
}

export interface FinancialSummary {
  totalBalance: FinancialMetric;
  totalExpense: FinancialMetric;
  totalSavings: FinancialMetric;
  lastUpdated: string;
}

export interface WorkingCapitalMonthlyRecord {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface WorkingCapitalSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface WorkingCapitalPayload {
  period: string;
  currency: string;
  data: WorkingCapitalMonthlyRecord[];
  summary: WorkingCapitalSummary;
}

export interface WalletCard {
  id: string;
  name: string;
  type: string;
  cardNumber: string;
  bank: string;
  network: string;
  expiryMonth: number;
  expiryYear: number;
  color: string;
  isDefault: boolean;
}

export interface WalletPayload {
  cards: WalletCard[];
}

export type WalletResponse = ApiResponse<WalletPayload>;

export interface Transaction {
  id: string;
  name: string;
  business: string;
  image: string;
  type: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  count: number;
}

export interface RecentTransactionsPayload {
  transactions: Transaction[];
  summary: TransactionSummary;
}

export interface ScheduledTransfer {
  id: string;
  name: string;
  image: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ScheduledTransfersSummary {
  totalScheduledAmount: number;
  count: number;
}

export interface ScheduledTransfersPayload {
  transfers: ScheduledTransfer[];
  summary: ScheduledTransfersSummary;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastLoginIP?: string;
}
