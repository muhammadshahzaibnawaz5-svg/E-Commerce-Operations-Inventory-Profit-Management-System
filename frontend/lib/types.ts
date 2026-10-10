export type RoleName =
  | "Owner / Admin"
  | "Manager"
  | "Inventory"
  | "Order Processing"
  | "Finance";

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: RoleName;
  status: "active" | "disabled";
}

export interface Role {
  name: RoleName;
  description: string;
}

export interface OtpSession {
  email: string;
  code: string;
  issuedAt: string;
  expiresInSeconds: number;
  verified: boolean;
}

export type StoreConnectionStatus = "Connected" | "Disconnected" | "Error";

export interface EntityCounts {
  products: number;
  customers: number;
  orders: number;
  payments: number;
  refunds: number;
  inventory: number;
}

export interface Store {
  id: string;
  name: string;
  shopifyUrl: string;
  connectionStatus: StoreConnectionStatus;
  lastSyncedAt: string | null;
  entityCounts: EntityCounts;
}

export type SyncEntityState = "queued" | "importing" | "complete";

export interface SyncRun {
  storeId: string;
  startedAt: string;
  status: "connecting" | "importing" | "complete";
  entities: { name: string; state: SyncEntityState }[];
}

export type OrderStatus = "New" | "Confirmed" | "Packed" | "Shipped" | "Delivered";
export type OrderOutcome = "Cancelled" | "Returned" | "Failed Delivery" | "Refunded";
export type PaymentType = "Prepaid" | "COD";

export interface OrderItem {
  product: string;
  qty: number;
  unitPrice: number;
}

export interface OrderCosts {
  manufacturing: number;
  packaging: number;
  courier: number;
  advertising: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  placedAt: string;
  customer: string;
  status: OrderStatus | OrderOutcome;
  courier: string | null;
  paymentType: PaymentType;
  total: number;
  items: OrderItem[];
  costs: Partial<OrderCosts>;
}

export interface OrderStatusHistory {
  orderId: string;
  status: string;
  changedAt: string;
  changedBy: string;
}

export interface Courier {
  id: string;
  name: string;
  isActive: boolean;
  apiAvailable: boolean;
}

export interface CourierCharge {
  shipping: number;
  cod: number;
  return: number;
}

export interface TrackingEvent {
  at: string;
  description: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  courierId: string;
  trackingNumber: string;
  status: string;
  charges: CourierCharge;
  events: TrackingEvent[];
}

export type SettlementStatus = "Pending" | "PartiallyReceived" | "Received" | "Settled";
export type PaymentKind = "Prepaid" | "COD";

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  customer: string;
  type: PaymentKind;
  amount: number;
  status: SettlementStatus;
  deliveredAt: string | null;
}

export interface SettlementTranche {
  share: "25%" | "75%";
  label: string;
  amount: number;
  dueDate: string;
  status: "Received" | "Pending";
}

export interface PaymentSummary {
  received: number;
  pending: number;
  settled: number;
}

export type ReturnReason = "Customer Return" | "Failed Delivery" | "Refused";
export type RestockStatus = "Awaiting inspection" | "Restocked" | "Written off";

export interface ReturnItem {
  product: string;
  sellable: boolean | null;
}

export interface ReturnRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  customer: string;
  reason: ReturnReason;
  courier: string;
  advance: number;
  courierCost: number | null;
  amountReturned: number;
  restockStatus: RestockStatus;
  items: ReturnItem[];
}

export interface StockItem {
  id: string;
  name: string;
  unit: string;
  purchased: number;
  used: number;
  remaining: number;
  lowStockThreshold: number;
}

export interface FinishedGood {
  id: string;
  product: string;
  unit: string;
  stock: number;
  lowStockThreshold: number;
}

export interface ProductionRun {
  id: string;
  product: string;
  quantity: number;
  producedAt: string;
  consumed: { name: string; qty: number }[];
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  totalPurchased: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  item: string;
  quantity: number;
  unit: string;
  cost: number;
  purchasedAt: string;
}

export type AdPlatform = "Meta" | "TikTok";

export interface AdCampaign {
  id: string;
  platform: AdPlatform;
  name: string;
  source: "API" | "Manual";
}

export interface AdSpend {
  id: string;
  campaignId: string;
  date: string;
  amount: number;
}

export type ExpenseType = "selling" | "operating";

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  note: string;
  type: ExpenseType;
}

export interface ProfitLossStatement {
  period: string;
  netRevenue: number;
  cogs: { manufacturing: number; packaging: number; total: number };
  grossProfit: number;
  sellingCosts: { courier: number; advertising: number; total: number };
  operatingExpenses: number;
  operatingProfit: number;
  netProfit: number;
}

export interface ProductProfit {
  product: string;
  units: number;
  revenue: number;
  manufacturing: number;
  packaging: number;
  courier: number;
  advertising: number;
  profit: number;
}

export interface DashboardMetric {
  key: string;
  label: string;
  value: number;
  delta: string;
}