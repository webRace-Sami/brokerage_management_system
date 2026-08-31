import fs from 'fs';
import path from 'path';
import { getMongoDb } from './mongodb';
import { hashPassword } from './auth';

// Initial Company & Business Profile
const initialCompanySettings = {
  name: 'Madina Goods Transport Company',
  phone: '0300-6501234',
  uan: '047-6331234',
  location: 'Sargodha Road Bypass, Chiniot, Punjab, Pakistan',
  description: 'Premier Goods Transport, Logistics & Brokerage Management Portal serving nationwide freight routes from Chiniot.',
  establishedYear: '1998',
  terms: 'مال کی لوڈنگ و انلوڈنگ کے دوران مکمل احتیاط کی جاتی ہے۔ کسی بھی حادثہ کی صورت میں بلٹی شرائط لاگو ہوں گی۔',
};

// Initial Stock Types
const initialStockTypes = [
  {
    id: 'st_sugar',
    name: 'Sugar (چینی)',
    nameUrdu: 'چینی ریفائنڈ',
    code: 'ST-SUG',
    category: 'Food & Sweeteners',
    defaultUnit: 'Bags' as const,
    standardWeightKg: 50,
    defaultUnitPricePkr: 7200,
    description: 'Grade-1 White Refined Sugar in 50kg Bags from Punjab Mills.',
  },
  {
    id: 'st_oil',
    name: 'Edible Oil & Ghee (تیل و گھی)',
    nameUrdu: 'کوکنگ آئل و بناسپتی گھی',
    code: 'ST-OIL',
    category: 'Edible Oils',
    defaultUnit: 'Drums' as const,
    standardWeightKg: 16,
    defaultUnitPricePkr: 8500,
    description: 'Cooking Oil and Banaspati Ghee in 16kg Tins, Drums & Cartons.',
  },
  {
    id: 'st_wheat',
    name: 'Wheat (گندم)',
    nameUrdu: 'گندم سپریم',
    code: 'ST-WHT',
    category: 'Grains & Agriculture',
    defaultUnit: 'Bags' as const,
    standardWeightKg: 50,
    defaultUnitPricePkr: 5400,
    description: 'Punjab Passco standard agricultural wheat 50kg bags.',
  },
  {
    id: 'st_rice',
    name: 'Basmati Rice (چاول)',
    nameUrdu: 'سپر کرنیل چاول',
    code: 'ST-RIC',
    category: 'Food Grains',
    defaultUnit: 'Bags' as const,
    standardWeightKg: 50,
    defaultUnitPricePkr: 14800,
    description: 'Export quality Super Kernel Basmati Rice 50kg bags.',
  },
  {
    id: 'st_cotton',
    name: 'Raw Cotton & Bales (روئی و پھٹی)',
    nameUrdu: 'پھٹی و روئی گانٹھیں',
    code: 'ST-COT',
    category: 'Textile Raw Material',
    defaultUnit: 'Bales' as const,
    standardWeightKg: 100,
    defaultUnitPricePkr: 28500,
    description: 'Pressed Raw Cotton Bales for Textile Spinning Mills.',
  },
  {
    id: 'st_fertilizer',
    name: 'Fertilizer & DAP (کھاد سونا یوریا)',
    nameUrdu: 'یوریا کھاد',
    code: 'ST-FER',
    category: 'Agriculture Chemicals',
    defaultUnit: 'Bags' as const,
    standardWeightKg: 50,
    defaultUnitPricePkr: 4600,
    description: 'FFC/Engro Sona Urea and DAP 50kg Bags.',
  },
];

// Active Users: Only Admin maintained as requested (demo munshis removed)
const initialUsers = [
  {
    id: 'user_admin',
    name: 'Haji Abdul Rehman (Admin)',
    username: 'admin',
    email: 'admin@madinagoods.com',
    password: '$2a$10$wN6pY2HjGjK1u9k5c8z6Qe0vVbQz8W3rT4u2X5vY7z8W3rT4u2X5v',
    plainPassword: 'MadinaAdmin@2026!',
    role: 'ADMIN' as const,
    phone: '0300-6501234',
    createdAt: '2026-08-28T08:00:00.000Z',
  },
];

// Initial Brokers
const initialBrokers = [
  {
    id: 'broker_main_1',
    name: 'Madina Main Broker (Haji Rasheed & Sons)',
    type: 'MAIN_BROKER' as const,
    phone: '0300-9876543',
    city: 'Chiniot',
    stockTypes: ['Wheat (گندم)', 'Basmati Rice (چاول)', 'Fertilizer & DAP (کھاد سونا یوریا)'],
    ownAvailableBags: 4500,
    ownAvailableWeight: 5625,
    manualStockValuationPkr: 39500000,
    isAttachedToMainBroker: true,
    allocatedQuotaBags: 0,
    allocatedQuotaWeight: 0,
    commissionRate: 0,
  },
  {
    id: 'broker_co1',
    name: 'Tariq Chinioti Brokery',
    type: 'CO_BROKER' as const,
    phone: '0301-4455667',
    city: 'Chiniot / Faisalabad',
    stockTypes: ['Wheat (گندم)', 'Raw Cotton & Bales (روئی و پھٹی)'],
    ownAvailableBags: 450,
    ownAvailableWeight: 562.5,
    manualStockValuationPkr: 5445000,
    isAttachedToMainBroker: true,
    attachedToMainBrokerId: 'broker_main_1',
    allocatedQuotaBags: 800,
    allocatedQuotaWeight: 1000,
    commissionRate: 2.5,
  },
  {
    id: 'broker_co2',
    name: 'Bilal Gujjar & Co.',
    type: 'CO_BROKER' as const,
    phone: '0321-7788990',
    city: 'Lahore',
    stockTypes: ['Sugar (چینی)', 'Edible Oil & Ghee (تیل و گھی)'],
    ownAvailableBags: 250,
    ownAvailableWeight: 312.5,
    manualStockValuationPkr: 3630000,
    isAttachedToMainBroker: true,
    attachedToMainBrokerId: 'broker_main_1',
    allocatedQuotaBags: 650,
    allocatedQuotaWeight: 812.5,
    commissionRate: 2.0,
  },
];

// Initial Stock Items
const initialStockItems = [
  {
    id: 'stock_1',
    code: 'IRN-WHT-101',
    name: 'Wheat Grade-A Super (گندم سپریم)',
    category: 'Grains & Agriculture',
    standardBagWeightKg: 50,
    unitPricePkr: 5400,
    description: 'Cleaned, high-yield agricultural wheat in standard 50kg bags.',
    totalBagsInward: 1400,
    totalWeightKg: 70000,
    availableBags: 1200,
    availableWeightKg: 60000,
  },
  {
    id: 'stock_2',
    code: 'IRN-RIC-102',
    name: 'Basmati Rice Super Kernel (سپر کرنیل چاول)',
    category: 'Food Grains',
    standardBagWeightKg: 50,
    unitPricePkr: 14800,
    description: 'Export quality aromatic super kernel basmati rice 50kg bags.',
    totalBagsInward: 1100,
    totalWeightKg: 55000,
    availableBags: 890,
    availableWeightKg: 44500,
  },
  {
    id: 'stock_3',
    code: 'IRN-SUG-103',
    name: 'Refined White Sugar Premium (چینی ریفائنڈ)',
    category: 'Sugar & Sweeteners',
    standardBagWeightKg: 50,
    unitPricePkr: 7200,
    description: 'Grade-1 crystal white refined sugar from Chiniot mills.',
    totalBagsInward: 950,
    totalWeightKg: 47500,
    availableBags: 800,
    availableWeightKg: 40000,
  },
  {
    id: 'stock_4',
    code: 'IRN-COT-104',
    name: 'Raw Cotton Ginning Bales (پھٹی و روئی)',
    category: 'Textile Raw Material',
    standardBagWeightKg: 100,
    unitPricePkr: 28500,
    description: 'Pressed raw cotton bales from Punjab ginning units.',
    totalBagsInward: 450,
    totalWeightKg: 45000,
    availableBags: 390,
    availableWeightKg: 39000,
  },
  {
    id: 'stock_5',
    code: 'IRN-FER-105',
    name: 'Sona Urea / DAP Fertilizer (کھاد سونا یوریا)',
    category: 'Fertilizers',
    standardBagWeightKg: 50,
    unitPricePkr: 4600,
    description: 'FFC standard agricultural nitrogen fertilizer 50kg bags.',
    totalBagsInward: 800,
    totalWeightKg: 40000,
    availableBags: 620,
    availableWeightKg: 31000,
  },
];

// Initial Dispatches with format YYYYMMDD01, YYYYMMDD02...
const initialDispatches = [
  {
    id: 'disp_1',
    irn: '2026082801',
    srNo: 1,
    biltyNo: 'MGT-2026-1001',
    brokerId: 'broker_main_1',
    brokerName: 'Madina Main Broker (Haji Rasheed & Sons)',
    brokerType: 'MAIN_BROKER' as const,
    stockSource: 'MAIN_BROKER_STOCK' as const,
    stockItemId: 'stock_2',
    stockType: 'Basmati Rice (چاول)',
    materialDescription: 'Basmati Rice Super Kernel',
    quantityBags: 120,
    quantityUnit: 'Bags' as const,
    weightKg: 6000,
    weightMaunds: 150,
    weightSlipNo: 'xdk-2983 / 232444',
    truckNo: 'FD-4512',
    driverName: 'Muhammad Ramzan',
    driverCnic: '33202-1456789-3',
    driverPhone: '0301-7654321',
    shopName: 'Madina Karyana Store & General Order',
    shopkeeperName: 'Sheikh Farooq Ahmed',
    shopkeeperPhone: '0321-8899001',
    destinationAddress: 'Gole Karyana Market, Shop #14',
    destinationCity: 'Faisalabad',
    rentAmountPkr: 28500,
    rentStatus: 'PAID' as const,
    advancePaidPkr: 28500,
    remainingRentPkr: 0,
    balancePkr: 0,
    paymentMethod: 'Cash Handover',
    paymentDate: '2026-08-28',
    dispatchedBy: 'Admin Haji Abdul Rehman',
    dispatchDate: '2026-08-28',
    remarks: 'Delivered in good condition',
    createdAt: new Date('2026-08-28T09:30:00Z').toISOString(),
  },
  {
    id: 'disp_2',
    irn: '2026082802',
    srNo: 2,
    biltyNo: 'MGT-2026-1002',
    brokerId: 'broker_co1',
    brokerName: 'Tariq Chinioti Brokery',
    brokerType: 'CO_BROKER' as const,
    stockSource: 'MAIN_BROKER_STOCK' as const,
    stockItemId: 'stock_1',
    stockType: 'Wheat (گندم)',
    materialDescription: 'Wheat Grade-A Super',
    quantityBags: 200,
    quantityUnit: 'Bags' as const,
    weightKg: 10000,
    weightMaunds: 250,
    weightSlipNo: 'WS-8921 / 554312',
    truckNo: 'CHT-8921',
    driverName: 'Allah Ditta Khokhar',
    driverCnic: '33201-9876543-1',
    driverPhone: '0302-6543210',
    shopName: 'Al-Rehman Flour Mills & Depo',
    shopkeeperName: 'Chaudhry Naveed',
    shopkeeperPhone: '0300-1122334',
    destinationAddress: 'Badami Bagh Truck Stand Area',
    destinationCity: 'Lahore',
    rentAmountPkr: 45000,
    rentStatus: 'PENDING' as const,
    advancePaidPkr: 20000,
    remainingRentPkr: 25000,
    balancePkr: 25000,
    paymentMethod: 'Advance 20k, Balance on Delivery',
    paymentDate: '2026-08-28',
    dispatchedBy: 'Admin Haji Abdul Rehman',
    dispatchDate: '2026-08-28',
    remarks: 'PKR 25,000 balance due upon arrival',
    createdAt: new Date('2026-08-28T14:15:00Z').toISOString(),
  },
  {
    id: 'disp_3',
    irn: '2026082901',
    srNo: 3,
    biltyNo: 'MGT-2026-1003',
    brokerId: 'broker_co2',
    brokerName: 'Bilal Gujjar & Co.',
    brokerType: 'CO_BROKER' as const,
    stockSource: 'OWN_STOCK' as const,
    stockItemId: 'stock_3',
    stockType: 'Sugar (چینی)',
    materialDescription: 'Refined White Sugar Premium',
    quantityBags: 150,
    quantityUnit: 'Bags' as const,
    weightKg: 7500,
    weightMaunds: 187.5,
    weightSlipNo: 'KND-4019 / 889102',
    truckNo: 'LHR-7860',
    driverName: 'Sardar Gul Khan',
    driverCnic: '33100-3456712-7',
    driverPhone: '0304-9871234',
    shopName: 'Bismillah Sweet Bakers & Mart',
    shopkeeperName: 'Haji Mukhtar Butt',
    shopkeeperPhone: '0333-7766554',
    destinationAddress: 'Railway Road, Block-4',
    destinationCity: 'Sargodha',
    rentAmountPkr: 22000,
    rentStatus: 'PAID' as const,
    advancePaidPkr: 22000,
    remainingRentPkr: 0,
    balancePkr: 0,
    paymentMethod: 'Bank Online Slip',
    paymentDate: '2026-08-29',
    dispatchedBy: 'Admin Haji Abdul Rehman',
    dispatchDate: '2026-08-29',
    remarks: 'Full freight cleared',
    createdAt: new Date('2026-08-29T10:00:00Z').toISOString(),
  },
  {
    id: 'disp_4',
    irn: '2026082902',
    srNo: 4,
    biltyNo: 'MGT-2026-1004',
    brokerId: 'broker_main_1',
    brokerName: 'Madina Main Broker (Haji Rasheed & Sons)',
    brokerType: 'MAIN_BROKER' as const,
    stockSource: 'MAIN_BROKER_STOCK' as const,
    stockItemId: 'stock_5',
    stockType: 'Fertilizer & DAP (کھاد سونا یوریا)',
    materialDescription: 'Sona Urea Fertilizer',
    quantityBags: 180,
    quantityUnit: 'Bags' as const,
    weightKg: 9000,
    weightMaunds: 225,
    weightSlipNo: 'KND-9012 / 112234',
    truckNo: 'FD-9923',
    driverName: 'Muhammad Arshad',
    driverCnic: '33202-7654321-5',
    driverPhone: '0305-6547891',
    shopName: 'Kisan Zari Markaz & Seed Agency',
    shopkeeperName: 'Mian Tariq Jameel',
    shopkeeperPhone: '0301-4433221',
    destinationAddress: 'Main Jhang Road Chowk',
    destinationCity: 'Jhang',
    rentAmountPkr: 31000,
    rentStatus: 'PENDING' as const,
    advancePaidPkr: 10000,
    remainingRentPkr: 21000,
    balancePkr: 21000,
    paymentMethod: 'Cash On Bilty Collection',
    paymentDate: '2026-08-29',
    dispatchedBy: 'Admin Haji Abdul Rehman',
    dispatchDate: '2026-08-29',
    remarks: '',
    createdAt: new Date('2026-08-29T11:45:00Z').toISOString(),
  },
  {
    id: 'disp_5',
    irn: '2026082903',
    srNo: 5,
    biltyNo: 'MGT-2026-1005',
    brokerId: 'broker_co1',
    brokerName: 'Tariq Chinioti Brokery',
    brokerType: 'CO_BROKER' as const,
    stockSource: 'OWN_STOCK' as const,
    stockItemId: 'stock_4',
    stockType: 'Raw Cotton & Bales (روئی و پھٹی)',
    materialDescription: 'Raw Cotton Ginning Bales',
    quantityBags: 60,
    quantityUnit: 'Bales' as const,
    weightKg: 6000,
    weightMaunds: 150,
    weightSlipNo: 'COT-7712 / 990143',
    truckNo: 'KHI-6012',
    driverName: 'Noor Muhammad Pathan',
    driverCnic: '33201-1122334-9',
    driverPhone: '0345-9876543',
    shopName: 'Sitara Textile Mills Godown #3',
    shopkeeperName: 'Khawaja Faisal Masood',
    shopkeeperPhone: '0322-5566778',
    destinationAddress: 'SITE Industrial Area, Manghopir',
    destinationCity: 'Karachi',
    rentAmountPkr: 125000,
    rentStatus: 'PAID' as const,
    advancePaidPkr: 125000,
    remainingRentPkr: 0,
    balancePkr: 0,
    paymentMethod: 'Company Cheque',
    paymentDate: '2026-08-29',
    dispatchedBy: 'Admin Haji Abdul Rehman',
    dispatchDate: '2026-08-29',
    remarks: 'Cross-country transit',
    createdAt: new Date('2026-08-29T15:30:00Z').toISOString(),
  },
  {
    id: 'disp_6',
    irn: '2026083001',
    srNo: 6,
    biltyNo: 'MGT-2026-1006',
    brokerId: 'broker_co2',
    brokerName: 'Bilal Gujjar & Co.',
    brokerType: 'CO_BROKER' as const,
    stockSource: 'OWN_STOCK' as const,
    stockItemId: null,
    stockType: 'Edible Oil & Ghee (تیل و گھی)',
    materialDescription: 'Premium Cooking Banaspati Oil',
    quantityBags: 80,
    quantityUnit: 'Drums' as const,
    weightKg: 1280,
    weightMaunds: 32,
    weightSlipNo: 'xdk-2983 / 232444',
    truckNo: 'LHR-5566',
    driverName: 'Rashid Mehmood',
    driverCnic: '33202-6677889-1',
    driverPhone: null,
    shopName: 'Al-Madina Oil Traders',
    shopkeeperName: 'Haji Shakeel',
    shopkeeperPhone: null,
    destinationAddress: 'Main City Bazaar',
    destinationCity: 'Lahore',
    rentAmountPkr: 26000,
    rentStatus: 'PENDING' as const,
    advancePaidPkr: 16000,
    remainingRentPkr: 10000,
    balancePkr: 10000,
    paymentMethod: 'Cash Slip',
    paymentDate: '2026-08-30',
    dispatchedBy: 'Admin Haji Abdul Rehman',
    dispatchDate: '2026-08-30',
    remarks: null,
    createdAt: '2026-08-30T10:47:33.940Z',
  },
];

declare global {
  var _inMemoryStore: any;
}

function saveStore(data: any) {
  global._inMemoryStore = data;
  const jsonStr = JSON.stringify(data, null, 2);

  // 1. Write to local workspace storage if writable
  try {
    const localPath = path.join(process.cwd(), '.data_store.json');
    fs.writeFileSync(localPath, jsonStr, 'utf-8');
  } catch (e) {}

  // 2. Also write to /tmp for serverless container preservation
  try {
    const tmpPath = path.join('/tmp', '.data_store.json');
    fs.writeFileSync(tmpPath, jsonStr, 'utf-8');
  } catch (e) {}
}

function loadStore() {
  if (global._inMemoryStore && global._inMemoryStore.brokers && global._inMemoryStore.dispatches) {
    return global._inMemoryStore;
  }

  // 1. Check /tmp first for latest serverless state
  try {
    const tmpPath = path.join('/tmp', '.data_store.json');
    if (fs.existsSync(tmpPath)) {
      const content = fs.readFileSync(tmpPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.brokers && parsed.dispatches) {
        if (!parsed.companySettings) parsed.companySettings = initialCompanySettings;
        if (!parsed.stockTypes) parsed.stockTypes = initialStockTypes;
        if (!parsed.users) parsed.users = initialUsers;
        global._inMemoryStore = parsed;
        return parsed;
      }
    }
  } catch (e) {}

  // 2. Check local project root .data_store.json
  try {
    const localPath = path.join(process.cwd(), '.data_store.json');
    if (fs.existsSync(localPath)) {
      const content = fs.readFileSync(localPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.brokers && parsed.dispatches) {
        if (!parsed.companySettings) parsed.companySettings = initialCompanySettings;
        if (!parsed.stockTypes) parsed.stockTypes = initialStockTypes;
        if (!parsed.users) parsed.users = initialUsers;
        global._inMemoryStore = parsed;
        return parsed;
      }
    }
  } catch (e) {}

  const defaultStore = {
    companySettings: initialCompanySettings,
    stockTypes: initialStockTypes,
    users: initialUsers,
    brokers: initialBrokers,
    stockItems: initialStockItems,
    dispatches: initialDispatches,
  };
  global._inMemoryStore = defaultStore;
  saveStore(defaultStore);
  return defaultStore;
}

export const db = {
  // FULL STORE & SYNC
  getFullStore: () => {
    return loadStore();
  },

  syncFullStore: (incomingStore: any) => {
    if (!incomingStore || typeof incomingStore !== 'object') {
      return loadStore();
    }
    const current = loadStore();
    const merged = {
      companySettings: incomingStore.companySettings || current.companySettings || initialCompanySettings,
      stockTypes: Array.isArray(incomingStore.stockTypes) && incomingStore.stockTypes.length > 0 ? incomingStore.stockTypes : (current.stockTypes || initialStockTypes),
      users: Array.isArray(incomingStore.users) && incomingStore.users.length > 0 ? incomingStore.users : (current.users || initialUsers),
      brokers: Array.isArray(incomingStore.brokers) && incomingStore.brokers.length > 0 ? incomingStore.brokers : (current.brokers || initialBrokers),
      stockItems: Array.isArray(incomingStore.stockItems) && incomingStore.stockItems.length > 0 ? incomingStore.stockItems : (current.stockItems || initialStockItems),
      dispatches: Array.isArray(incomingStore.dispatches) ? incomingStore.dispatches : (current.dispatches || initialDispatches),
    };
    saveStore(merged);
    return merged;
  },

  // COMPANY SETTINGS
  getCompanySettings: async () => {
    const store = loadStore();
    return store.companySettings || initialCompanySettings;
  },

  updateCompanySettings: async (updates: any) => {
    const store = loadStore();
    store.companySettings = {
      ...store.companySettings,
      ...updates,
    };
    saveStore(store);
    return store.companySettings;
  },

  // STOCK TYPES
  getStockTypes: async () => {
    const store = loadStore();
    return store.stockTypes || initialStockTypes;
  },

  addStockType: async (typeData: any) => {
    const store = loadStore();
    const newType = {
      id: `st_${Date.now()}`,
      name: typeData.name.trim(),
      nameUrdu: typeData.nameUrdu || typeData.name,
      code: typeData.code ? typeData.code.trim().toUpperCase() : `ST-${Date.now().toString().slice(-3)}`,
      category: typeData.category || 'General Cargo',
      defaultUnit: typeData.defaultUnit || 'Bags',
      standardWeightKg: Number(typeData.standardWeightKg) || 50,
      defaultUnitPricePkr: Number(typeData.defaultUnitPricePkr) || 5000,
      description: typeData.description || '',
    };
    if (!store.stockTypes) store.stockTypes = [];
    store.stockTypes.push(newType);
    saveStore(store);
    return newType;
  },

  updateStockType: async (id: string, updates: any) => {
    const store = loadStore();
    const index = store.stockTypes.findIndex((st: any) => st.id === id);
    if (index !== -1) {
      store.stockTypes[index] = {
        ...store.stockTypes[index],
        ...updates,
      };
      saveStore(store);
      return store.stockTypes[index];
    }
    return null;
  },

  deleteStockType: async (id: string) => {
    const store = loadStore();
    const index = store.stockTypes.findIndex((st: any) => st.id === id);
    if (index !== -1) {
      const deleted = store.stockTypes.splice(index, 1)[0];
      saveStore(store);
      return deleted;
    }
    return null;
  },

  // USER MANAGEMENT
  getUsers: async () => {
    const store = loadStore();
    return store.users || initialUsers;
  },

  createUser: async (userData: {
    name: string;
    username: string;
    email: string;
    password?: string;
    plainPassword?: string;
    role?: 'ADMIN' | 'EMPLOYEE';
    phone?: string;
  }) => {
    const store = loadStore();
    const cleanUsername = userData.username.trim().toLowerCase();
    
    // Check for existing username or email
    const exists = store.users.some(
      (u: any) => u.username?.toLowerCase() === cleanUsername || (userData.email && u.email?.toLowerCase() === userData.email.trim().toLowerCase())
    );
    if (exists) {
      throw new Error(`Username "${cleanUsername}" or Email already exists.`);
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name.trim(),
      username: cleanUsername,
      email: userData.email?.trim() || `${cleanUsername}@madinagoods.com`,
      password: userData.plainPassword ? hashPassword(userData.plainPassword) : (userData.password || hashPassword('MunshiPass@2026')),
      plainPassword: userData.plainPassword || 'MunshiPass@2026',
      role: userData.role || 'EMPLOYEE',
      phone: userData.phone?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    store.users.push(newUser);
    saveStore(store);
    return newUser;
  },

  updateUser: async (id: string, updates: any) => {
    const store = loadStore();
    const index = store.users.findIndex((u: any) => u.id === id);
    if (index !== -1) {
      const current = store.users[index];
      
      // If updating username, check uniqueness
      if (updates.username && updates.username.toLowerCase().trim() !== current.username.toLowerCase()) {
        const check = updates.username.toLowerCase().trim();
        if (store.users.some((u: any) => u.id !== id && u.username?.toLowerCase() === check)) {
          throw new Error(`Username "${check}" is already taken.`);
        }
      }

      if (updates.plainPassword) {
        updates.password = hashPassword(updates.plainPassword);
      }

      store.users[index] = {
        ...current,
        ...updates,
      };
      saveStore(store);
      return store.users[index];
    }
    return null;
  },

  deleteUser: async (id: string) => {
    const store = loadStore();
    const index = store.users.findIndex((u: any) => u.id === id);
    if (index !== -1) {
      const user = store.users[index];
      if (user.id === 'user_admin' || user.username === 'admin') {
        throw new Error('Primary Administrator account cannot be deleted.');
      }
      const deleted = store.users.splice(index, 1)[0];
      saveStore(store);
      return deleted;
    }
    return null;
  },

  findUser: async (query: { usernameOrEmail?: string; id?: string }) => {
    const store = loadStore();
    if (query.id) {
      return store.users.find((u: any) => u.id === query.id || u.username?.toLowerCase() === query.id?.toLowerCase()) || null;
    }
    if (query.usernameOrEmail) {
      const q = query.usernameOrEmail.toLowerCase().trim();
      return store.users.find((u: any) => u.username?.toLowerCase() === q || u.email?.toLowerCase() === q) || null;
    }
    return null;
  },

  // BROKERS
  getBrokers: async () => {
    const store = loadStore();
    return store.brokers;
  },

  createBroker: async (brokerData: {
    name: string;
    type: 'MAIN_BROKER' | 'CO_BROKER';
    phone: string;
    city?: string;
    stockTypes?: string[];
    ownAvailableBags?: number;
    ownAvailableWeight?: number;
    manualStockValuationPkr?: number;
    isAttachedToMainBroker?: boolean;
    attachedToMainBrokerId?: string;
    allocatedQuotaBags?: number;
    allocatedQuotaWeight?: number;
    commissionRate?: number;
  }) => {
    const store = loadStore();
    const bags = Number(brokerData.ownAvailableBags) || 0;
    const isMain = brokerData.type === 'MAIN_BROKER';

    const newBroker = {
      id: `broker_${isMain ? 'main_' : 'co_'}${Date.now()}`,
      name: brokerData.name.trim(),
      type: brokerData.type,
      phone: brokerData.phone.trim(),
      city: brokerData.city?.trim() || 'Chiniot',
      stockTypes: Array.isArray(brokerData.stockTypes) && brokerData.stockTypes.length > 0 ? brokerData.stockTypes : ['General Cargo'],
      ownAvailableBags: bags,
      ownAvailableWeight: Number(brokerData.ownAvailableWeight) || (bags * 50) / 40,
      manualStockValuationPkr: brokerData.manualStockValuationPkr !== undefined && brokerData.manualStockValuationPkr !== null ? Number(brokerData.manualStockValuationPkr) : undefined,
      isAttachedToMainBroker: isMain ? true : (brokerData.isAttachedToMainBroker !== undefined ? brokerData.isAttachedToMainBroker : true),
      attachedToMainBrokerId: isMain ? undefined : brokerData.attachedToMainBrokerId,
      allocatedQuotaBags: isMain ? 0 : (Number(brokerData.allocatedQuotaBags) || 500),
      allocatedQuotaWeight: isMain ? 0 : (Number(brokerData.allocatedQuotaWeight) || ((Number(brokerData.allocatedQuotaBags) || 500) * 50) / 40),
      commissionRate: Number(brokerData.commissionRate) || (isMain ? 0 : 2.0),
      createdAt: new Date().toISOString(),
    };
    store.brokers.push(newBroker);
    saveStore(store);
    return newBroker;
  },

  updateBroker: async (id: string, updates: any) => {
    const store = loadStore();
    const index = store.brokers.findIndex((b: any) => b.id === id || b.name?.toLowerCase() === id?.toLowerCase());
    if (index !== -1) {
      const current = store.brokers[index];
      const ownBags = updates.ownAvailableBags !== undefined ? Number(updates.ownAvailableBags) : current.ownAvailableBags;
      const quotaBags = updates.allocatedQuotaBags !== undefined ? Number(updates.allocatedQuotaBags) : current.allocatedQuotaBags;

      store.brokers[index] = {
        ...current,
        ...updates,
        ownAvailableBags: ownBags,
        ownAvailableWeight: (ownBags * 50) / 40,
        allocatedQuotaBags: quotaBags,
        allocatedQuotaWeight: (quotaBags * 50) / 40,
      };
      saveStore(store);
      return store.brokers[index];
    }
    return null;
  },

  deleteBroker: async (id: string) => {
    const store = loadStore();
    const index = store.brokers.findIndex((b: any) => b.id === id || b.name?.toLowerCase() === id?.toLowerCase());
    if (index !== -1) {
      const deleted = store.brokers.splice(index, 1)[0];
      saveStore(store);
      return deleted;
    }
    return null;
  },

  // STOCK ITEMS
  getStockItems: async () => {
    const store = loadStore();
    return store.stockItems;
  },

  addStockItem: async (itemData: any) => {
    const store = loadStore();
    const newItem = {
      id: `stock_${Date.now()}`,
      totalBagsInward: 0,
      totalWeightKg: 0,
      availableBags: 0,
      availableWeightKg: 0,
      ...itemData,
    };
    store.stockItems.push(newItem);
    saveStore(store);
    return newItem;
  },

  addStockInward: async (inwardData: any) => {
    const store = loadStore();
    const stock = store.stockItems.find((s: any) => s.id === inwardData.stockItemId || s.name?.toLowerCase() === inwardData.stockItemId?.toLowerCase());
    if (stock) {
      const bags = Number(inwardData.quantityBags) || 0;
      const wtKg = Number(inwardData.weightKg) || (bags * (stock.standardBagWeightKg || 50));
      stock.totalBagsInward = (stock.totalBagsInward || 0) + bags;
      stock.totalWeightKg = (stock.totalWeightKg || 0) + wtKg;
      stock.availableBags = (stock.availableBags || 0) + bags;
      stock.availableWeightKg = (stock.availableWeightKg || 0) + wtKg;
    }
    saveStore(store);
    return inwardData;
  },

  recordStockInward: async (inwardData: {
    stockItemId: string;
    bagsAdded: number;
    weightKgAdded?: number;
    supplierName?: string;
    notes?: string;
  }) => {
    const store = loadStore();
    const stock = store.stockItems.find((s: any) => s.id === inwardData.stockItemId || s.name?.toLowerCase() === inwardData.stockItemId?.toLowerCase());
    if (!stock) throw new Error('Stock item not found');

    const bags = Number(inwardData.bagsAdded) || 0;
    const wtKg = Number(inwardData.weightKgAdded) || (bags * (stock.standardBagWeightKg || 50));

    stock.totalBagsInward += bags;
    stock.totalWeightKg += wtKg;
    stock.availableBags += bags;
    stock.availableWeightKg += wtKg;

    saveStore(store);
    return stock;
  },

  // DISPATCHES & IRN (Format: YYYYMMDD01, YYYYMMDD02, YYYYMMDD03...)
  getDispatches: async (filters?: { brokerId?: string; rentStatus?: string; search?: string; irn?: string }) => {
    const store = loadStore();
    let list = [...store.dispatches].reverse();

    if (filters?.brokerId && filters.brokerId !== 'ALL') {
      list = list.filter((d: any) => d.brokerId === filters.brokerId);
    }
    if (filters?.rentStatus && filters.rentStatus !== 'ALL') {
      list = list.filter((d: any) => d.rentStatus === filters.rentStatus);
    }
    if (filters?.irn) {
      const q = filters.irn.toLowerCase().trim().replace(/^irn#?/i, '');
      list = list.filter((d: any) => (d.irn || '').toLowerCase().includes(q) || d.srNo?.toString() === q || d.biltyNo?.toLowerCase().includes(q));
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase().trim();
      list = list.filter(
        (d: any) =>
          (d.irn || '').toLowerCase().includes(s) ||
          d.srNo?.toString() === s ||
          d.biltyNo?.toLowerCase().includes(s) ||
          d.weightSlipNo?.toLowerCase().includes(s) ||
          d.materialDescription?.toLowerCase().includes(s) ||
          d.stockType?.toLowerCase().includes(s) ||
          d.truckNo?.toLowerCase().includes(s) ||
          d.driverName?.toLowerCase().includes(s) ||
          d.driverCnic?.toLowerCase().includes(s) ||
          d.shopName?.toLowerCase().includes(s) ||
          d.shopkeeperName?.toLowerCase().includes(s) ||
          d.destinationCity?.toLowerCase().includes(s) ||
          d.brokerName?.toLowerCase().includes(s)
      );
    }

    return list;
  },

  createDispatch: async (dispatchData: any) => {
    const store = loadStore();
    const dispatchDate = dispatchData.dispatchDate || new Date().toISOString().split('T')[0];
    const cleanDate = dispatchDate.replace(/-/g, '');
    
    // Strict incremental sequential IRN based on highest existing SR Number
    const maxSrNo = store.dispatches.reduce((max: number, d: any) => Math.max(max, Number(d.srNo) || 0), 0);
    const srNo = maxSrNo + 1;
    const seq = String(srNo).padStart(2, '0');
    const irn = `${cleanDate}${seq}`;
    
    // Support manual Bilty Number or fallback
    const biltyNo = dispatchData.biltyNo ? dispatchData.biltyNo.trim() : `MGT-2026-${String(1000 + srNo)}`;

    const parsedRent = Number(dispatchData.rentAmountPkr) || 0;
    const parsedAdvance = Number(dispatchData.advancePaidPkr) || (dispatchData.rentStatus === 'PAID' ? parsedRent : 0);
    const remainingRentPkr = Math.max(0, parsedRent - parsedAdvance);
    const rentStatus = remainingRentPkr === 0 ? 'PAID' : 'PENDING';

    const paymentDate = dispatchData.paymentDate || dispatchDate;
    const quantityUnit = dispatchData.quantityUnit || 'Bags';
    const weightSlipNo = dispatchData.weightSlipNo ? dispatchData.weightSlipNo.trim() : `xdk-${Math.floor(1000 + Math.random() * 9000)} / ${Math.floor(100000 + Math.random() * 900000)}`;

    let bName = dispatchData.brokerName;
    let bType = dispatchData.brokerType;
    if (dispatchData.brokerId) {
      const b = store.brokers.find((x: any) => x.id === dispatchData.brokerId);
      if (b) {
        bName = b.name;
        bType = b.type;
      }
    }

    const newDispatch = {
      ...dispatchData,
      id: `disp_${Date.now()}`,
      irn,
      srNo,
      biltyNo,
      weightSlipNo,
      quantityUnit,
      brokerName: bName || dispatchData.brokerName || 'Main Broker',
      brokerType: bType || dispatchData.brokerType || 'MAIN_BROKER',
      rentAmountPkr: parsedRent,
      advancePaidPkr: parsedAdvance,
      remainingRentPkr,
      balancePkr: remainingRentPkr,
      rentStatus,
      dispatchDate,
      paymentDate,
      createdAt: new Date().toISOString(),
    };

    store.dispatches.push(newDispatch);

    // LIVE SIMULTANEOUS STOCK DEDUCTION (Main-Broker & Co-Brokers)
    const qty = Number(newDispatch.quantityBags) || 0;
    const wtKg = Number(newDispatch.weightKg) || qty * 50;

    // 1. Deduct from the related broker (Main-Broker or Co-Broker)
    const relatedBroker = store.brokers.find((b: any) => b.id === newDispatch.brokerId);
    if (relatedBroker) {
      relatedBroker.ownAvailableBags = Math.max(0, (relatedBroker.ownAvailableBags || 0) - qty);
      relatedBroker.ownAvailableWeight = Number(((relatedBroker.ownAvailableBags * 50) / 40.0).toFixed(2));

      // If Co-Broker is selling Main-Broker stock, also deduct from the attached Main-Broker
      if (relatedBroker.type === 'CO_BROKER' && (newDispatch.stockSource === 'MAIN_BROKER_STOCK' || !newDispatch.stockSource)) {
        const mainBroker = store.brokers.find((b: any) => b.id === relatedBroker.attachedToMainBrokerId) || store.brokers.find((b: any) => b.type === 'MAIN_BROKER');
        if (mainBroker) {
          mainBroker.ownAvailableBags = Math.max(0, (mainBroker.ownAvailableBags || 0) - qty);
          mainBroker.ownAvailableWeight = Number(((mainBroker.ownAvailableBags * 50) / 40.0).toFixed(2));
        }
      }
    } else {
      const mainBroker = store.brokers.find((b: any) => b.type === 'MAIN_BROKER');
      if (mainBroker) {
        mainBroker.ownAvailableBags = Math.max(0, (mainBroker.ownAvailableBags || 0) - qty);
        mainBroker.ownAvailableWeight = Number(((mainBroker.ownAvailableBags * 50) / 40.0).toFixed(2));
      }
    }

    // 2. Deduct matching stock item
    if (newDispatch.stockItemId) {
      const stockItem = store.stockItems.find((s: any) => s.id === newDispatch.stockItemId);
      if (stockItem) {
        stockItem.availableBags = Math.max(0, (stockItem.availableBags || 0) - qty);
        stockItem.availableWeightKg = Math.max(0, (stockItem.availableWeightKg || 0) - wtKg);
      }
    } else if (newDispatch.stockType) {
      const stockItem = store.stockItems.find((s: any) => (s.name || '').toLowerCase().includes((newDispatch.stockType || '').toLowerCase().split(' ')[0]));
      if (stockItem) {
        stockItem.availableBags = Math.max(0, (stockItem.availableBags || 0) - qty);
        stockItem.availableWeightKg = Math.max(0, (stockItem.availableWeightKg || 0) - wtKg);
      }
    }

    saveStore(store);
    return newDispatch;
  },

  updateDispatch: async (id: string, updates: any) => {
    const store = loadStore();
    const index = store.dispatches.findIndex((d: any) => d.id === id || String(d.srNo) === String(id) || d.irn === id || d.biltyNo === id);
    if (index !== -1) {
      const current = store.dispatches[index];
      const rent = updates.rentAmountPkr !== undefined ? Number(updates.rentAmountPkr) : current.rentAmountPkr;
      const adv = updates.advancePaidPkr !== undefined ? Number(updates.advancePaidPkr) : current.advancePaidPkr;
      const remainingRentPkr = Math.max(0, rent - adv);
      const status = remainingRentPkr === 0 ? 'PAID' : (updates.rentStatus || 'PENDING');

      store.dispatches[index] = {
        ...current,
        ...updates,
        rentAmountPkr: rent,
        advancePaidPkr: adv,
        remainingRentPkr,
        balancePkr: remainingRentPkr,
        rentStatus: status,
      };
      saveStore(store);
      return store.dispatches[index];
    }
    return null;
  },

  updatePayment: async (id: string, advancePaidPkr: number, paymentMethod?: string, paymentDate?: string) => {
    const store = loadStore();
    const item = store.dispatches.find((d: any) => d.id === id || String(d.srNo) === String(id) || d.irn === id || d.biltyNo === id);
    if (item) {
      item.advancePaidPkr = advancePaidPkr;
      item.remainingRentPkr = Math.max(0, item.rentAmountPkr - advancePaidPkr);
      item.balancePkr = item.remainingRentPkr;
      item.rentStatus = item.remainingRentPkr === 0 ? 'PAID' : 'PENDING';
      if (paymentMethod) item.paymentMethod = paymentMethod;
      if (paymentDate) item.paymentDate = paymentDate;
      saveStore(store);
      return item;
    }
    return null;
  },

  toggleRentStatus: async (id: string) => {
    const store = loadStore();
    const item = store.dispatches.find((d: any) => d.id === id || String(d.srNo) === String(id) || d.irn === id || d.biltyNo === id);
    if (item) {
      const nextStatus = item.rentStatus === 'PAID' ? 'PENDING' : 'PAID';
      item.rentStatus = nextStatus;
      item.advancePaidPkr = nextStatus === 'PAID' ? item.rentAmountPkr : 0;
      item.remainingRentPkr = nextStatus === 'PAID' ? 0 : item.rentAmountPkr;
      item.balancePkr = item.remainingRentPkr;
      item.paymentDate = new Date().toISOString().split('T')[0];
      saveStore(store);
      return item;
    }
    return null;
  },

  deleteDispatch: async (id: string) => {
    const store = loadStore();
    const index = store.dispatches.findIndex((d: any) => d.id === id || String(d.srNo) === String(id) || d.irn === id || d.biltyNo === id);
    if (index !== -1) {
      const deleted = store.dispatches.splice(index, 1)[0];
      const qty = Number(deleted.quantityBags) || 0;
      const wtKg = Number(deleted.weightKg) || qty * 50;

      // 1. Restore to related broker
      const relatedBroker = store.brokers.find((b: any) => b.id === deleted.brokerId);
      if (relatedBroker) {
        relatedBroker.ownAvailableBags = (relatedBroker.ownAvailableBags || 0) + qty;
        relatedBroker.ownAvailableWeight = Number(((relatedBroker.ownAvailableBags * 50) / 40.0).toFixed(2));

        if (relatedBroker.type === 'CO_BROKER' && (deleted.stockSource === 'MAIN_BROKER_STOCK' || !deleted.stockSource)) {
          const mainBroker = store.brokers.find((b: any) => b.id === relatedBroker.attachedToMainBrokerId) || store.brokers.find((b: any) => b.type === 'MAIN_BROKER');
          if (mainBroker) {
            mainBroker.ownAvailableBags = (mainBroker.ownAvailableBags || 0) + qty;
            mainBroker.ownAvailableWeight = Number(((mainBroker.ownAvailableBags * 50) / 40.0).toFixed(2));
          }
        }
      } else {
        const mainBroker = store.brokers.find((b: any) => b.type === 'MAIN_BROKER');
        if (mainBroker) {
          mainBroker.ownAvailableBags = (mainBroker.ownAvailableBags || 0) + qty;
          mainBroker.ownAvailableWeight = Number(((mainBroker.ownAvailableBags * 50) / 40.0).toFixed(2));
        }
      }

      // 2. Restore Stock Item
      if (deleted.stockItemId) {
        const stock = store.stockItems.find((s: any) => s.id === deleted.stockItemId);
        if (stock) {
          stock.availableBags = (stock.availableBags || 0) + qty;
          stock.availableWeightKg = (stock.availableWeightKg || 0) + wtKg;
        }
      } else if (deleted.stockType) {
        const stock = store.stockItems.find((s: any) => (s.name || '').toLowerCase().includes((deleted.stockType || '').toLowerCase().split(' ')[0]));
        if (stock) {
          stock.availableBags = (stock.availableBags || 0) + qty;
          stock.availableWeightKg = (stock.availableWeightKg || 0) + wtKg;
        }
      }

      saveStore(store);
      return deleted;
    }
    return null;
  },
};
