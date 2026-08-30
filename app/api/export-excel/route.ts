import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('brokerId') || undefined;
    const rentStatus = searchParams.get('rentStatus') || undefined;
    const search = searchParams.get('search')?.toLowerCase().trim() || undefined;

    const dispatches = await db.getDispatches({ brokerId, rentStatus, search });

    // Format rows for Excel
    const rows = dispatches.map((d: any) => ({
      'Sr No.': d.srNo,
      'Bilty No.': d.biltyNo,
      'Broker Name': d.brokerName,
      'Broker Type': d.brokerType === 'MAIN_BROKER' ? 'Main Broker' : 'Co-Broker',
      'Goods Description': d.materialDescription,
      'Quantity (Bags/Pcs)': d.quantityBags,
      'Weight (Kg)': d.weightKg,
      'Weight (Maunds)': d.weightMaunds,
      'Truck Number': d.truckNo,
      'Driver Name': d.driverName,
      'Driver CNIC': d.driverCnic,
      'Driver Phone': d.driverPhone || 'N/A',
      'Destination Shop': d.shopName,
      'Shopkeeper Name': d.shopkeeperName,
      'Shopkeeper Phone': d.shopkeeperPhone || 'N/A',
      'Destination City': d.destinationCity,
      'Destination Address': d.destinationAddress,
      'Rent Amount (PKR)': d.rentAmountPkr,
      'Rent Status': d.rentStatus,
      'Advance Paid (PKR)': d.advancePaidPkr,
      'Balance (PKR)': d.balancePkr,
      'Payment Mode': d.paymentMethod,
      'Munshi Dispatcher': d.dispatchedBy,
      'Dispatch Date': new Date(d.dispatchDate).toLocaleDateString('en-GB'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const columnWidths = [
      { wch: 8 },
      { wch: 16 },
      { wch: 28 },
      { wch: 14 },
      { wch: 30 },
      { wch: 18 },
      { wch: 14 },
      { wch: 16 },
      { wch: 14 },
      { wch: 22 },
      { wch: 18 },
      { wch: 16 },
      { wch: 26 },
      { wch: 22 },
      { wch: 16 },
      { wch: 18 },
      { wch: 30 },
      { wch: 18 },
      { wch: 14 },
      { wch: 18 },
      { wch: 16 },
      { wch: 16 },
      { wch: 22 },
      { wch: 16 },
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dispatches Data');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const filename = `Madina_Goods_Dispatches_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Excel export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel report', details: error.message },
      { status: 500 }
    );
  }
}
