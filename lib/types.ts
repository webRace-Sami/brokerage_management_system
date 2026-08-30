export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  phone?: string;
  plainPassword?: string;
  createdAt?: string;
}

export interface CompanySettings {
  name: string;
  phone: string;
  uan: string;
  location: string;
  description: string;
  establishedYear: string;
  terms: string;
}

export interface StockTypeData {
  id: string;
  name: string;
  nameUrdu?: string;
  code: string;
  category: string;
  defaultUnit: 'Bags' | 'Nugs' | 'Box' | 'Drums' | 'Bales' | 'Pcs';
  standardWeightKg: number;
  defaultUnitPricePkr: number;
  description?: string;
}

export interface BrokerData {
  id: string;
  name: string;
  type: 'MAIN_BROKER' | 'CO_BROKER';
  phone: string;
  city: string;
  stockTypes: string[];
  ownAvailableBags: number;
  ownAvailableWeight: number;
  manualStockValuationPkr?: number;
  isAttachedToMainBroker: boolean;
  attachedToMainBrokerId?: string;
  allocatedQuotaBags: number;
  allocatedQuotaWeight: number;
  commissionRate: number;
  soldBags?: number;
  ownSoldBags?: number;
  remainQuotaBags?: number;
  remainQuotaWeight?: number;
  totalValuationPkr?: number;
}

export interface StockItemData {
  id: string;
  code: string;
  name: string;
  stockTypeId?: string;
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
  irn: string;                    // Format: YYYYMMDD01, YYYYMMDD02...
  srNo: number;
  biltyNo: string;                // Editable / Manual Bilty Number
  brokerId: string;
  brokerName: string;
  brokerType: 'MAIN_BROKER' | 'CO_BROKER';
  stockSource: 'MAIN_BROKER_STOCK' | 'OWN_STOCK';
  stockItemId?: string;
  stockType?: string;
  materialDescription: string;
  quantityBags: number;
  quantityUnit: 'Bags' | 'Nugs' | 'Box' | 'Drums' | 'Bales' | 'Pcs';
  weightKg: number;
  weightMaunds: number;
  weightSlipNo: string;
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
  remainingRentPkr: number;
  balancePkr: number;
  paymentMethod: string;
  paymentDate?: string;
  dispatchedBy: string;
  dispatchDate: string;
  remarks?: string;
  createdAt: string;
}

export interface DashboardSummary {
  company: CompanySettings;
  stockTypes: StockTypeData[];
  stockItems?: StockItemData[];
  mainBrokers: Array<{
    id: string;
    name: string;
    phone: string;
    city: string;
    stockTypes: string[];
    availableBags: number;
    totalWeightKg: number;
    totalWeightMaunds: number;
    remainBags: number;
    totalValuationPkr: number;
    isManualValuation: boolean;
  }>;
  coBrokers: Array<{
    id: string;
    name: string;
    phone: string;
    city: string;
    stockTypes: string[];
    ownAvailableBags: number;
    ownAvailableWeight: number;
    isAttachedToMainBroker: boolean;
    attachedToMainBrokerName?: string;
    allocatedQuotaBags: number;
    soldBags: number;
    ownSoldBags: number;
    remainQuotaBags: number;
    soldWeightMaunds: number;
    totalValuationPkr: number;
    isManualValuation: boolean;
    quotaPercentage: number;
  }>;
  grandTotals: {
    totalBags: number;
    totalWeightKg: number;
    totalWeightMaunds: number;
    totalWeightTons: number;
    totalRentPkr: number;
    paidRentPkr: number;
    remainingRentPkr: number;
    totalDispatches: number;
  };
}
