export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  phone?: string;
}

export interface BrokerData {
  id: string;
  name: string;
  type: 'MAIN_BROKER' | 'CO_BROKER';
  phone: string;
  city: string;
  allocatedQuotaBags: number;
  allocatedQuotaWeight: number;
  commissionRate: number;
  soldBags?: number;
  soldWeight?: number;
  remainQuotaBags?: number;
  remainQuotaWeight?: number;
}

export interface StockItemData {
  id: string;
  code: string;
  name: string;
  category: string;
  standardBagWeightKg: number;
  unitPricePkr: number;
  description: string;
  totalBagsInward: number;
  totalWeightKg: number;
  availableBags: number;
  availableWeightKg: number;
}

export interface DispatchData {
  id: string;
  srNo: number;
  biltyNo: string;
  brokerId: string;
  brokerName: string;
  brokerType: 'MAIN_BROKER' | 'CO_BROKER';
  stockItemId?: string;
  materialDescription: string;
  quantityBags: number;
  weightKg: number;
  weightMaunds: number;
  truckNo: string;
  driverName: string;
  driverCnic: string;
  driverPhone?: string;
  shopName: string;
  shopkeeperName: string;
  shopkeeperPhone?: string;
  destinationAddress: string;
  destinationCity: string;
  rentAmountPkr: number;
  rentStatus: 'PAID' | 'PENDING';
  advancePaidPkr: number;
  balancePkr: number;
  paymentMethod: string;
  dispatchedBy: string;
  dispatchDate: string;
  remarks?: string;
  createdAt: string;
}

export interface DashboardSummary {
  mainBroker: {
    name: string;
    totalValuationPkr: number;
    availableBags: number;
    totalWeightKg: number;
    totalWeightMaunds: number;
    remainBags: number;
  };
  coBrokers: Array<{
    id: string;
    name: string;
    phone: string;
    allocatedQuotaBags: number;
    soldBags: number;
    remainQuotaBags: number;
    soldWeightMaunds: number;
    totalValuationPkr: number;
    quotaPercentage: number;
  }>;
  grandTotals: {
    totalBags: number;
    totalWeightKg: number;
    totalWeightMaunds: number;
    totalWeightTons: number;
    totalRentPkr: number;
    paidRentPkr: number;
    pendingRentPkr: number;
    totalDispatches: number;
  };
}
