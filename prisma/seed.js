const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Madina Goods Transport Company...');

  // 1. Clean existing records (if any)
  await prisma.dispatch.deleteMany({});
  await prisma.stockInward.deleteMany({});
  await prisma.stockItem.deleteMany({});
  await prisma.broker.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing tables.');

  // 2. Create Single Admin and 5 Munshi Employees
  const adminPasswordHash = bcrypt.hashSync('MadinaAdmin@2026!', 10);
  const employeePasswordHash = bcrypt.hashSync('MunshiPass@2026', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Haji Abdul Rehman (Admin)',
      username: 'admin',
      email: 'admin@madinagoods.com',
      password: adminPasswordHash,
      role: 'ADMIN',
      phone: '0300-6501234',
    },
  });

  const employeesData = [
    { name: 'Munshi Muhammad Aslam', username: 'munshi1', email: 'aslam@madinagoods.com', phone: '0301-7890123' },
    { name: 'Munshi Tariq Mehmood', username: 'munshi2', email: 'tariq@madinagoods.com', phone: '0302-3456789' },
    { name: 'Munshi Imran Zafar', username: 'munshi3', email: 'imran@madinagoods.com', phone: '0303-9012345' },
    { name: 'Munshi Bilal Gujjar', username: 'munshi4', email: 'bilal@madinagoods.com', phone: '0304-4567890' },
    { name: 'Munshi Waqas Ahmed', username: 'munshi5', email: 'waqas@madinagoods.com', phone: '0305-1234567' },
  ];

  for (const emp of employeesData) {
    await prisma.user.create({
      data: {
        name: emp.name,
        username: emp.username,
        email: emp.email,
        password: employeePasswordHash,
        role: 'EMPLOYEE',
        phone: emp.phone,
      },
    });
  }

  console.log('✅ Created Admin (admin / MadinaAdmin@2026!) and 5 Munshi Employees (munshi1-5 / MunshiPass@2026)');

  // 3. Create Main Broker and Co-Brokers
  const mainBroker = await prisma.broker.create({
    data: {
      name: 'Madina Main Broker (Haji Rasheed & Sons)',
      type: 'MAIN_BROKER',
      phone: '0300-9876543',
      city: 'Chiniot',
      allocatedQuotaBags: 5000,
      allocatedQuotaWeight: 6250, // in Maunds
      commissionRate: 0,
    },
  });

  const coBroker1 = await prisma.broker.create({
    data: {
      name: 'Tariq Chinioti Brokery',
      type: 'CO_BROKER',
      phone: '0301-4455667',
      city: 'Chiniot / Faisalabad',
      allocatedQuotaBags: 800,
      allocatedQuotaWeight: 1000,
      commissionRate: 2.5,
    },
  });

  const coBroker2 = await prisma.broker.create({
    data: {
      name: 'Bilal Gujjar & Co.',
      type: 'CO_BROKER',
      phone: '0321-7788990',
      city: 'Lahore',
      allocatedQuotaBags: 650,
      allocatedQuotaWeight: 812.5,
      commissionRate: 2.0,
    },
  });

  const coBroker3 = await prisma.broker.create({
    data: {
      name: 'Malik Irfan Grain Traders',
      type: 'CO_BROKER',
      phone: '0333-2233445',
      city: 'Sargodha',
      allocatedQuotaBags: 500,
      allocatedQuotaWeight: 625,
      commissionRate: 2.0,
    },
  });

  console.log('✅ Created Main Broker and 3 Co-Brokers');

  // 4. Create Master Stock Items (IRN Registry)
  const stockItemsData = [
    {
      code: 'IRN-WHT-101',
      name: 'Wheat Grade-A Super (گندم سپریم)',
      category: 'Grains & Agriculture',
      standardBagWeightKg: 50.0,
      unitPricePkr: 5400,
      description: 'Cleaned, high-yield agricultural wheat packed in standard 50kg polypropylene bags.',
      totalBagsInward: 1400,
      totalWeightKg: 70000,
      availableBags: 1400,
      availableWeightKg: 70000,
    },
    {
      code: 'IRN-RIC-102',
      name: 'Basmati Rice Super Kernel (سپر کرنیل چاول)',
      category: 'Food Grains',
      standardBagWeightKg: 50.0,
      unitPricePkr: 14800,
      description: 'Export quality aromatic aged super kernel basmati rice 50kg double-stitched bags.',
      totalBagsInward: 1100,
      totalWeightKg: 55000,
      availableBags: 1100,
      availableWeightKg: 55000,
    },
    {
      code: 'IRN-SUG-103',
      name: 'Refined White Sugar Premium (چینی ریفائنڈ)',
      category: 'Sugar & Sweeteners',
      standardBagWeightKg: 50.0,
      unitPricePkr: 7200,
      description: 'Grade-1 fine crystal white refined sugar from Chiniot sugar mills.',
      totalBagsInward: 950,
      totalWeightKg: 47500,
      availableBags: 950,
      availableWeightKg: 47500,
    },
    {
      code: 'IRN-COT-104',
      name: 'Raw Cotton Ginning Bales (پھٹی و روئی)',
      category: 'Textile Raw Material',
      standardBagWeightKg: 100.0,
      unitPricePkr: 28500,
      description: 'Pressed raw cotton bales from central Punjab ginning units.',
      totalBagsInward: 450,
      totalWeightKg: 45000,
      availableBags: 450,
      availableWeightKg: 45000,
    },
    {
      code: 'IRN-FER-105',
      name: 'Sona Urea / DAP Fertilizer (کھاد سونا یوریا)',
      category: 'Fertilizers',
      standardBagWeightKg: 50.0,
      unitPricePkr: 4600,
      description: 'FFC standard agricultural nitrogen fertilizer 50kg moisture-resistant bags.',
      totalBagsInward: 800,
      totalWeightKg: 40000,
      availableBags: 800,
      availableWeightKg: 40000,
    },
  ];

  const createdStockItems = {};
  for (const item of stockItemsData) {
    const created = await prisma.stockItem.create({ data: item });
    createdStockItems[item.code] = created;

    // Create corresponding Inward record
    await prisma.stockInward.create({
      data: {
        irnCode: item.code,
        stockItemId: created.id,
        brokerId: mainBroker.id,
        materialName: item.name,
        quantityBags: item.totalBagsInward,
        weightKg: item.totalWeightKg,
        weightMaunds: item.totalWeightKg / 40.0, // 1 Maund = 40 kg
        unitRatePkr: item.unitPricePkr,
        totalValuationPkr: item.totalBagsInward * item.unitPricePkr,
        supplierName: 'Punjab Agro Corp & Chiniot Farmers Union',
        vehicleNo: 'TLA-7860',
        warehouseLocation: 'Sargodha Road Main Godown #1, Chiniot',
        receivedBy: 'Munshi Muhammad Aslam',
      },
    });
  }

  console.log('✅ Created 5 Master Stock Items (IRN Registry) and initial Inward Stock records');

  // 5. Seed Dispatch Records (with realistic Pakistani Goods Transport data)
  const dispatchesData = [
    {
      srNo: 1,
      biltyNo: 'MGT-2026-1001',
      brokerId: mainBroker.id,
      brokerName: mainBroker.name,
      brokerType: 'MAIN_BROKER',
      stockItemId: createdStockItems['IRN-RIC-102'].id,
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
      rentStatus: 'PAID',
      advancePaidPkr: 28500,
      balancePkr: 0,
      paymentMethod: 'Cash Handover',
      dispatchedBy: 'Munshi Muhammad Aslam',
    },
    {
      srNo: 2,
      biltyNo: 'MGT-2026-1002',
      brokerId: coBroker1.id,
      brokerName: coBroker1.name,
      brokerType: 'CO_BROKER',
      stockItemId: createdStockItems['IRN-WHT-101'].id,
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
      rentStatus: 'PENDING',
      advancePaidPkr: 15000,
      balancePkr: 30000,
      paymentMethod: 'Bilty Balance on Delivery',
      dispatchedBy: 'Munshi Tariq Mehmood',
    },
    {
      srNo: 3,
      biltyNo: 'MGT-2026-1003',
      brokerId: coBroker2.id,
      brokerName: coBroker2.name,
      brokerType: 'CO_BROKER',
      stockItemId: createdStockItems['IRN-SUG-103'].id,
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
      rentStatus: 'PAID',
      advancePaidPkr: 22000,
      balancePkr: 0,
      paymentMethod: 'Bank Online Slip',
      dispatchedBy: 'Munshi Imran Zafar',
    },
    {
      srNo: 4,
      biltyNo: 'MGT-2026-1004',
      brokerId: mainBroker.id,
      brokerName: mainBroker.name,
      brokerType: 'MAIN_BROKER',
      stockItemId: createdStockItems['IRN-FER-105'].id,
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
      rentStatus: 'PENDING',
      advancePaidPkr: 10000,
      balancePkr: 21000,
      paymentMethod: 'Cash On Bilty Collection',
      dispatchedBy: 'Munshi Bilal Gujjar',
    },
    {
      srNo: 5,
      biltyNo: 'MGT-2026-1005',
      brokerId: coBroker3.id,
      brokerName: coBroker3.name,
      brokerType: 'CO_BROKER',
      stockItemId: createdStockItems['IRN-COT-104'].id,
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
      rentStatus: 'PAID',
      advancePaidPkr: 125000,
      balancePkr: 0,
      paymentMethod: 'Company Cheque',
      dispatchedBy: 'Munshi Waqas Ahmed',
    },
    {
      srNo: 6,
      biltyNo: 'MGT-2026-1006',
      brokerId: coBroker1.id,
      brokerName: coBroker1.name,
      brokerType: 'CO_BROKER',
      stockItemId: createdStockItems['IRN-RIC-102'].id,
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
      rentStatus: 'PENDING',
      advancePaidPkr: 10000,
      balancePkr: 24000,
      paymentMethod: 'Bilty Due Payment',
      dispatchedBy: 'Munshi Muhammad Aslam',
    },
  ];

  for (const disp of dispatchesData) {
    await prisma.dispatch.create({ data: disp });

    // Deduct stock from stock item
    if (disp.stockItemId) {
      await prisma.stockItem.update({
        where: { id: disp.stockItemId },
        data: {
          availableBags: { decrement: disp.quantityBags },
          availableWeightKg: { decrement: disp.weightKg },
        },
      });
    }
  }

  console.log(`✅ Seeded ${dispatchesData.length} Dispatches with automatic inventory balance deduction`);
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
