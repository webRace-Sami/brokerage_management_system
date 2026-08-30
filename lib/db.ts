import prisma from './prisma';
import fs from 'fs';
import path from 'path';

// Initial Mock Seed Data
const initialUsers = [
  {
    id: 'user_admin',
    name: 'Haji Abdul Rehman (Admin)',
    username: 'admin',
    email: 'admin@madinagoods.com',
    password: '$2a$10$wN6pY2HjGjK1u9k5c8z6Qe0vVbQz8W3rT4u2X5vY7z8W3rT4u2X5v', // MadinaAdmin@2026!
    plainPassword: 'MadinaAdmin@2026!',
    role: 'ADMIN' as const,
    phone: '0300-6501234',
  },
  {
    id: 'user_munshi1',
    name: 'Munshi Muhammad Aslam',
    username: 'munshi1',
    email: 'aslam@madinagoods.com',
    password: '$2a$10$wN6pY2HjGjK1u9k5c8z6Qe0vVbQz8W3rT4u2X5vY7z8W3rT4u2X5v', // MunshiPass@2026
    plainPassword: 'MunshiPass@2026',
    role: 'EMPLOYEE' as const,
    phone: '0301-7890123',
  },
  {
    id: 'user_munshi2',
    name: 'Munshi Tariq Mehmood',
    username: 'munshi2',
    email: 'tariq@madinagoods.com',
    password: '$2a$10$wN6pY2HjGjK1u9k5c8z6Qe0vVbQz8W3rT4u2X5vY7z8W3rT4u2X5v',
    plainPassword: 'MunshiPass@2026',
    role: 'EMPLOYEE' as const,
    phone: '0302-3456789',
  },
  {
    id: 'user_munshi3',
    name: 'Munshi Imran Zafar',
    username: 'munshi3',
    email: 'imran@madinagoods.com',
    password: '$2a$10$wN6pY2HjGjK1u9k5c8z6Qe0vVbQz8W3rT4u2X5vY7z8W3rT4u2X5v',
    plainPassword: 'MunshiPass@2026',
    role: 'EMPLOYEE' as const,
    phone: '0303-9012345',
  },
  {
    id: 'user_munshi4',
    name: 'Munshi Bilal Gujjar',
    username: 'munshi4',
    email: 'bilal@madinagoods.com',
    password: '$2a$10$wN6pY2HjGjK1u9k5c8z6Qe0vVbQz8W3rT4u2X5vY7z8W3rT4u2X5v',
    plainPassword: 'MunshiPass@2026',
    role: 'EMPLOYEE' as const,
    phone: '0304-4567890',
  },
  {
    id: 'user_munshi5',
    name: 'Munshi Waqas Ahmed',
    username: 'munshi5',
    email: 'waqas@madinagoods.com',
    password: '$2a$10$wN6pY2HjGjK1u9k5c8z6Qe0vVbQz8W3rT4u2X5vY7z8W3rT4u2X5v',
    plainPassword: 'MunshiPass@2026',
    role: 'EMPLOYEE' as const,
    phone: '0305-1234567',
  },
];

const initialBrokers = [
  {
    id: 'broker_main',
    name: 'Madina Main Broker (Haji Rasheed & Sons)',
    type: 'MAIN_BROKER' as const,
    phone: '0300-9876543',
    city: 'Chiniot',
    allocatedQuotaBags: 5000,
    allocatedQuotaWeight: 6250,
    commissionRate: 0,
  },
  {
    id: 'broker_co1',
    name: 'Tariq Chinioti Brokery',
    type: 'CO_BROKER' as const,
    phone: '0301-4455667',
    city: 'Chiniot / Faisalabad',
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
    allocatedQuotaBags: 650,
    allocatedQuotaWeight: 812.5,
    commissionRate: 2.0,
  },
  {
    id: 'broker_co3',
    name: 'Malik Irfan Grain Traders',
    type: 'CO_BROKER' as const,
    phone: '0333-2233445',
    city: 'Sargodha',
    allocatedQuotaBags: 500,
    allocatedQuotaWeight: 625,
    commissionRate: 2.0,
  },
];

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

const initialDispatches = [
  {
    id: 'disp_1',
    srNo: 1,
    biltyNo: 'MGT-2026-1001',
    brokerId: 'broker_main',
    brokerName: 'Madina Main Broker (Haji Rasheed & Sons)',
    brokerType: 'MAIN_BROKER' as const,
    stockItemId: 'stock_2',
    materialDescription: 'Basmati Rice Super Kernel (120 Bags)',
    quantityBags: 120,
    weightKg: 6000,
    weightMaunds: 150,
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
    balancePkr: 0,
    paymentMethod: 'Cash Handover',
    dispatchedBy: 'Munshi Muhammad Aslam',
    dispatchDate: new Date('2026-08-28T09:30:00Z').toISOString(),
    remarks: 'Delivered in good condition',
    createdAt: new Date('2026-08-28T09:30:00Z').toISOString(),
  },
  {
    id: 'disp_2',
    srNo: 2,
    biltyNo: 'MGT-2026-1002',
    brokerId: 'broker_co1',
    brokerName: 'Tariq Chinioti Brokery',
    brokerType: 'CO_BROKER' as const,
    stockItemId: 'stock_1',
    materialDescription: 'Wheat Grade-A Super (200 Bags)',
    quantityBags: 200,
    weightKg: 10000,
    weightMaunds: 250,
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
    advancePaidPkr: 15000,
    balancePkr: 30000,
    paymentMethod: 'Bilty Balance on Delivery',
    dispatchedBy: 'Munshi Tariq Mehmood',
    dispatchDate: new Date('2026-08-28T14:15:00Z').toISOString(),
    remarks: 'Due payment on bilty handover',
    createdAt: new Date('2026-08-28T14:15:00Z').toISOString(),
  },
  {
    id: 'disp_3',
    srNo: 3,
    biltyNo: 'MGT-2026-1003',
    brokerId: 'broker_co2',
    brokerName: 'Bilal Gujjar & Co.',
    brokerType: 'CO_BROKER' as const,
    stockItemId: 'stock_3',
    materialDescription: 'Refined White Sugar Premium (150 Bags)',
    quantityBags: 150,
    weightKg: 7500,
    weightMaunds: 187.5,
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
    balancePkr: 0,
    paymentMethod: 'Bank Online Slip',
    dispatchedBy: 'Munshi Imran Zafar',
    dispatchDate: new Date('2026-08-29T10:00:00Z').toISOString(),
    remarks: 'Full freight cleared',
    createdAt: new Date('2026-08-29T10:00:00Z').toISOString(),
  },
  {
    id: 'disp_4',
    srNo: 4,
    biltyNo: 'MGT-2026-1004',
    brokerId: 'broker_main',
    brokerName: 'Madina Main Broker (Haji Rasheed & Sons)',
    brokerType: 'MAIN_BROKER' as const,
    stockItemId: 'stock_5',
    materialDescription: 'Sona Urea Fertilizer (180 Bags)',
    quantityBags: 180,
    weightKg: 9000,
    weightMaunds: 225,
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
    balancePkr: 21000,
    paymentMethod: 'Cash On Bilty Collection',
    dispatchedBy: 'Munshi Bilal Gujjar',
    dispatchDate: new Date('2026-08-29T11:45:00Z').toISOString(),
    remarks: '',
    createdAt: new Date('2026-08-29T11:45:00Z').toISOString(),
  },
  {
    id: 'disp_5',
    srNo: 5,
    biltyNo: 'MGT-2026-1005',
    brokerId: 'broker_co3',
    brokerName: 'Malik Irfan Grain Traders',
    brokerType: 'CO_BROKER' as const,
    stockItemId: 'stock_4',
    materialDescription: 'Raw Cotton Ginning Bales (60 Bales)',
    quantityBags: 60,
    weightKg: 6000,
    weightMaunds: 150,
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
    balancePkr: 0,
    paymentMethod: 'Company Cheque',
    dispatchedBy: 'Munshi Waqas Ahmed',
    dispatchDate: new Date('2026-08-29T15:30:00Z').toISOString(),
    remarks: 'Cross-country transit',
    createdAt: new Date('2026-08-29T15:30:00Z').toISOString(),
  },
  {
    id: 'disp_6',
    srNo: 6,
    biltyNo: 'MGT-2026-1006',
    brokerId: 'broker_co1',
    brokerName: 'Tariq Chinioti Brokery',
    brokerType: 'CO_BROKER' as const,
    stockItemId: 'stock_2',
    materialDescription: 'Basmati Rice Super Kernel (90 Bags)',
    quantityBags: 90,
    weightKg: 4500,
    weightMaunds: 112.5,
    truckNo: 'CHT-1134',
    driverName: 'Bashir Ahmed Sial',
    driverCnic: '33202-6549871-3',
    driverPhone: '0306-1122445',
    shopName: 'Gulshan Super Market',
    shopkeeperName: 'Malik Jahangir',
    shopkeeperPhone: '0300-8877665',
    destinationAddress: 'Main Civil Lines Road',
    destinationCity: 'Gujranwala',
    rentAmountPkr: 34000,
    rentStatus: 'PENDING' as const,
    advancePaidPkr: 10000,
    balancePkr: 24000,
    paymentMethod: 'Bilty Due Payment',
    dispatchedBy: 'Munshi Muhammad Aslam',
    dispatchDate: new Date('2026-08-29T17:00:00Z').toISOString(),
    remarks: '',
    createdAt: new Date('2026-08-29T17:00:00Z').toISOString(),
  },
];

// Persistent File Store Helper
const DATA_FILE = path.join(process.cwd(), '.data_store.json');

function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {}

  const defaultStore = {
    users: initialUsers,
    brokers: initialBrokers,
    stockItems: initialStockItems,
    dispatches: initialDispatches,
  };
  saveStore(defaultStore);
  return defaultStore;
}

function saveStore(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}

export const db = {
  // USERS
  findUser: async (query: { usernameOrEmail?: string; id?: string }) => {
    try {
      if (prisma?.user) {
        if (query.id) return await prisma.user.findUnique({ where: { id: query.id } });
        if (query.usernameOrEmail) {
          return await prisma.user.findFirst({
            where: {
              OR: [
                { username: query.usernameOrEmail.toLowerCase() },
                { email: query.usernameOrEmail.toLowerCase() },
              ],
            },
          });
        }
      }
    } catch (e) {}

    // Fallback store
    const store = loadStore();
    if (query.id) {
      return store.users.find((u: any) => u.id === query.id) || null;
    }
    if (query.usernameOrEmail) {
      const q = query.usernameOrEmail.toLowerCase().trim();
      return store.users.find((u: any) => u.username === q || u.email === q) || null;
    }
    return null;
  },

  // BROKERS
  getBrokers: async () => {
    try {
      if (prisma?.broker) {
        const brokers = await prisma.broker.findMany();
        if (brokers.length > 0) return brokers;
      }
    } catch (e) {}
    const store = loadStore();
    return store.brokers;
  },

  // STOCK ITEMS
  getStockItems: async () => {
    try {
      if (prisma?.stockItem) {
        const items = await prisma.stockItem.findMany();
        if (items.length > 0) return items;
      }
    } catch (e) {}
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

    try {
      if (prisma?.stockItem) {
        await prisma.stockItem.create({ data: newItem });
      }
    } catch (e) {}

    return newItem;
  },

  addStockInward: async (inwardData: any) => {
    const store = loadStore();
    const stockItem = store.stockItems.find((s: any) => s.id === inwardData.stockItemId);
    if (stockItem) {
      stockItem.totalBagsInward += inwardData.quantityBags;
      stockItem.totalWeightKg += inwardData.weightKg;
      stockItem.availableBags += inwardData.quantityBags;
      stockItem.availableWeightKg += inwardData.weightKg;
      saveStore(store);
    }

    try {
      if (prisma?.stockItem) {
        await prisma.stockItem.update({
          where: { id: inwardData.stockItemId },
          data: {
            totalBagsInward: { increment: inwardData.quantityBags },
            totalWeightKg: { increment: inwardData.weightKg },
            availableBags: { increment: inwardData.quantityBags },
            availableWeightKg: { increment: inwardData.weightKg },
          },
        });
      }
    } catch (e) {}

    return inwardData;
  },

  // DISPATCHES
  getDispatches: async (filters: { brokerId?: string; rentStatus?: string; search?: string }) => {
    let list: any[] = [];
    try {
      if (prisma?.dispatch) {
        list = await prisma.dispatch.findMany({ orderBy: { srNo: 'desc' } });
      }
    } catch (e) {}

    if (!list || list.length === 0) {
      const store = loadStore();
      list = [...store.dispatches].reverse();
    }

    if (filters.brokerId && filters.brokerId !== 'ALL') {
      list = list.filter((d) => d.brokerId === filters.brokerId);
    }
    if (filters.rentStatus && filters.rentStatus !== 'ALL') {
      list = list.filter((d) => d.rentStatus === filters.rentStatus);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.srNo?.toString().includes(s) ||
          d.biltyNo?.toLowerCase().includes(s) ||
          d.materialDescription?.toLowerCase().includes(s) ||
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
    const count = store.dispatches.length;
    const srNo = count + 1;
    const biltyNo = `MGT-2026-${String(1000 + srNo)}`;

    const newDispatch = {
      id: `disp_${Date.now()}`,
      srNo,
      biltyNo,
      dispatchDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...dispatchData,
    };

    store.dispatches.push(newDispatch);

    // Auto deduct stock
    if (newDispatch.stockItemId) {
      const stockItem = store.stockItems.find((s: any) => s.id === newDispatch.stockItemId);
      if (stockItem) {
        stockItem.availableBags = Math.max(0, stockItem.availableBags - newDispatch.quantityBags);
        stockItem.availableWeightKg = Math.max(0, stockItem.availableWeightKg - newDispatch.weightKg);
      }
    }

    saveStore(store);

    try {
      if (prisma?.dispatch) {
        await prisma.dispatch.create({ data: newDispatch });
        if (newDispatch.stockItemId) {
          await prisma.stockItem.update({
            where: { id: newDispatch.stockItemId },
            data: {
              availableBags: { decrement: newDispatch.quantityBags },
              availableWeightKg: { decrement: newDispatch.weightKg },
            },
          });
        }
      }
    } catch (e) {}

    return newDispatch;
  },

  updateDispatch: async (id: string, updates: any) => {
    const store = loadStore();
    const index = store.dispatches.findIndex((d: any) => d.id === id);
    if (index !== -1) {
      store.dispatches[index] = { ...store.dispatches[index], ...updates };
      saveStore(store);
      return store.dispatches[index];
    }
    return null;
  },

  toggleRentStatus: async (id: string) => {
    const store = loadStore();
    const item = store.dispatches.find((d: any) => d.id === id);
    if (item) {
      item.rentStatus = item.rentStatus === 'PAID' ? 'PENDING' : 'PAID';
      item.advancePaidPkr = item.rentStatus === 'PAID' ? item.rentAmountPkr : 0;
      item.balancePkr = item.rentStatus === 'PAID' ? 0 : item.rentAmountPkr;
      saveStore(store);
      return item;
    }
    return null;
  },

  deleteDispatch: async (id: string) => {
    const store = loadStore();
    const index = store.dispatches.findIndex((d: any) => d.id === id);
    if (index !== -1) {
      const deleted = store.dispatches.splice(index, 1)[0];
      // Restore stock
      if (deleted.stockItemId) {
        const stock = store.stockItems.find((s: any) => s.id === deleted.stockItemId);
        if (stock) {
          stock.availableBags += deleted.quantityBags;
          stock.availableWeightKg += deleted.weightKg;
        }
      }
      saveStore(store);
      return deleted;
    }
    return null;
  },
};
