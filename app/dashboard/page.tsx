'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import SummaryCards from '../../components/SummaryCards';
import GrandTotalsBar from '../../components/GrandTotalsBar';
import DispatchTable from '../../components/DispatchTable';
import NewDispatchModal from '../../components/NewDispatchModal';
import BrokerManagementModal from '../../components/BrokerManagementModal';
import UserManagementModal from '../../components/UserManagementModal';
import StockTypesManagementModal from '../../components/StockTypesManagementModal';
import CompanySettingsModal from '../../components/CompanySettingsModal';
import BiltyPrintModal from '../../components/BiltyPrintModal';
import EditDispatchModal from '../../components/EditDispatchModal';
import UpdatePaymentModal from '../../components/UpdatePaymentModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import Footer from '../../components/Footer';
import {
  UserProfile,
  DashboardSummary,
  DispatchData,
  BrokerData,
  StockItemData,
  StockTypeData,
  CompanySettings,
} from '../../lib/types';

export default function DashboardPage() {
  const router = useRouter();

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data States
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [dispatches, setDispatches] = useState<DispatchData[]>([]);
  const [brokers, setBrokers] = useState<BrokerData[]>([]);
  const [stockItems, setStockItems] = useState<StockItemData[]>([]);
  const [stockTypes, setStockTypes] = useState<StockTypeData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Filters
  const [activeBrokerTab, setActiveBrokerTab] = useState('ALL');
  const [selectedRentFilter, setSelectedRentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [irnFilter, setIrnFilter] = useState('');

  // Modal States
  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState(false);
  const [isBrokerSettingsOpen, setIsBrokerSettingsOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isStockTypesOpen, setIsStockTypesOpen] = useState(false);
  const [isCompanySettingsOpen, setIsCompanySettingsOpen] = useState(false);
  const [selectedBiltyDispatch, setSelectedBiltyDispatch] = useState<DispatchData | null>(null);
  const [selectedEditDispatch, setSelectedEditDispatch] = useState<DispatchData | null>(null);
  const [selectedPaymentDispatch, setSelectedPaymentDispatch] = useState<DispatchData | null>(null);
  const [selectedDeleteDispatch, setSelectedDeleteDispatch] = useState<DispatchData | null>(null);

  // Check Authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else {
          const stored = localStorage.getItem('madina_user');
          if (stored) {
            setCurrentUser(JSON.parse(stored));
          } else {
            router.push('/login');
          }
        }
      } catch (err) {
        const stored = localStorage.getItem('madina_user');
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          router.push('/login');
        }
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch Dashboard Summary & Stock Types
  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard/summary?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data: DashboardSummary = await res.json();
        setSummary(data);
        if (data.company) setCompany(data.company);
        if (data.stockTypes) setStockTypes(data.stockTypes);
      }
    } catch (err) {
      console.error('Failed to fetch summary', err);
    }
  }, []);

  // Fetch Dispatches with Filters
  const fetchDispatches = useCallback(async () => {
    setDataLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeBrokerTab && activeBrokerTab !== 'ALL') {
        params.append('brokerId', activeBrokerTab);
      }
      if (selectedRentFilter && selectedRentFilter !== 'ALL') {
        params.append('rentStatus', selectedRentFilter);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (irnFilter.trim()) {
        params.append('irn', irnFilter.trim());
      }
      params.append('_t', Date.now().toString());

      const res = await fetch(`/api/dispatches?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setDispatches(data.dispatches || []);
      }
    } catch (err) {
      console.error('Failed to fetch dispatches', err);
    } finally {
      setDataLoading(false);
    }
  }, [activeBrokerTab, selectedRentFilter, searchQuery, irnFilter]);

  // Fetch Brokers
  const fetchBrokers = useCallback(async () => {
    try {
      const res = await fetch(`/api/brokers?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setBrokers(data.brokers || []);
      }
    } catch (err) {
      console.error('Failed to fetch brokers', err);
    }
  }, []);

  // Fetch Stock Items
  const fetchStockItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/stock-items?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStockItems(data.stockItems || []);
      }
    } catch (err) {
      console.error('Failed to fetch stock items', err);
    }
  }, []);

  // Initial Data Load
  useEffect(() => {
    if (!authLoading) {
      fetchSummary();
      fetchBrokers();
      fetchStockItems();
      fetchDispatches();
    }
  }, [authLoading, fetchSummary, fetchBrokers, fetchStockItems, fetchDispatches]);

  // Refetch dispatches on filter change
  useEffect(() => {
    if (!authLoading) {
      fetchDispatches();
    }
  }, [authLoading, fetchDispatches]);

  // Refresh All Data
  const handleRefreshAll = async () => {
    await Promise.all([fetchSummary(), fetchDispatches(), fetchBrokers(), fetchStockItems()]);
  };

  // Toggle Rent Status
  const handleToggleRentStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/dispatches/${id}/toggle-rent`, { method: 'POST' });
      if (res.ok) {
        handleRefreshAll();
      }
    } catch (err) {
      console.error('Toggle rent status error', err);
    }
  };

  // Export to Genuine Excel (.xlsx)
  const handleExportExcel = async () => {
    if (dispatches.length === 0) {
      alert('No dispatch records to export.');
      return;
    }

    try {
      const params = new URLSearchParams();
      if (activeBrokerTab && activeBrokerTab !== 'ALL') {
        params.append('brokerId', activeBrokerTab);
      }
      if (selectedRentFilter && selectedRentFilter !== 'ALL') {
        params.append('rentStatus', selectedRentFilter);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const res = await fetch(`/api/export-excel?${params.toString()}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Madina_Goods_Transport_Dispatches_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        window.open('/api/export-excel', '_blank');
      }
    } catch (err) {
      window.open('/api/export-excel', '_blank');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-semibold font-['Outfit'] text-emerald-400 text-lg">
            Loading Madina Goods Portal...
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.username === 'admin';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar user={currentUser} company={company} />

      {/* Main Dashboard Workspace */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Section 1: Main-Brokers & Co-Brokers Grid Boxes with Stock Types & Valuations */}
        <SummaryCards
          summary={summary}
          activeBrokerTab={activeBrokerTab}
          onSelectBrokerTab={(id) => setActiveBrokerTab(id)}
          onOpenBrokerSettings={() => setIsBrokerSettingsOpen(true)}
          onOpenUserManagement={() => setIsUserManagementOpen(true)}
          onOpenStockTypes={() => setIsStockTypesOpen(true)}
          onOpenCompanySettings={() => setIsCompanySettingsOpen(true)}
          isAdmin={isAdmin}
        />

        {/* Section 2: Fixed Cumulative Metrics Bar */}
        <GrandTotalsBar summary={summary} />

        {/* Section 3: Central Dispatch & Stock Data Table with IRN, Weight Slips & Packaging Units */}
        <DispatchTable
          dispatches={dispatches}
          loading={dataLoading}
          currentUser={currentUser}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          irnFilter={irnFilter}
          onIrnFilterChange={(irn) => setIrnFilter(irn)}
          selectedRentFilter={selectedRentFilter}
          onRentFilterChange={(status) => setSelectedRentFilter(status)}
          onToggleRentStatus={handleToggleRentStatus}
          onOpenNewDispatch={() => setIsNewDispatchOpen(true)}
          onPrintBilty={(dispatch) => setSelectedBiltyDispatch(dispatch)}
          onEditDispatch={(dispatch) => setSelectedEditDispatch(dispatch)}
          onUpdatePayment={(dispatch) => setSelectedPaymentDispatch(dispatch)}
          onDeleteDispatch={(dispatch) => setSelectedDeleteDispatch(dispatch)}
          onExportExcel={handleExportExcel}
          onRefresh={handleRefreshAll}
        />
      </main>

      {/* Modals */}
      <NewDispatchModal
        isOpen={isNewDispatchOpen}
        onClose={() => setIsNewDispatchOpen(false)}
        onSuccess={handleRefreshAll}
        brokers={brokers}
        stockItems={stockItems}
        stockTypes={stockTypes}
      />

      <BrokerManagementModal
        isOpen={isBrokerSettingsOpen}
        onClose={() => setIsBrokerSettingsOpen(false)}
        onSuccess={handleRefreshAll}
        brokers={brokers}
        stockTypes={stockTypes}
        currentUser={currentUser}
      />

      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
        onSuccess={handleRefreshAll}
      />

      <StockTypesManagementModal
        isOpen={isStockTypesOpen}
        onClose={() => setIsStockTypesOpen(false)}
        onSuccess={handleRefreshAll}
        stockTypes={stockTypes}
        currentUser={currentUser}
      />

      <CompanySettingsModal
        isOpen={isCompanySettingsOpen}
        onClose={() => setIsCompanySettingsOpen(false)}
        onSuccess={handleRefreshAll}
        company={company}
        currentUser={currentUser}
      />

      <BiltyPrintModal
        isOpen={!!selectedBiltyDispatch}
        onClose={() => setSelectedBiltyDispatch(null)}
        dispatch={selectedBiltyDispatch}
        company={company}
      />

      <EditDispatchModal
        isOpen={!!selectedEditDispatch}
        onClose={() => setSelectedEditDispatch(null)}
        onSuccess={handleRefreshAll}
        dispatch={selectedEditDispatch}
      />

      <UpdatePaymentModal
        isOpen={!!selectedPaymentDispatch}
        onClose={() => setSelectedPaymentDispatch(null)}
        onSuccess={handleRefreshAll}
        dispatch={selectedPaymentDispatch}
      />

      <DeleteConfirmModal
        isOpen={!!selectedDeleteDispatch}
        onClose={() => setSelectedDeleteDispatch(null)}
        onSuccess={handleRefreshAll}
        dispatch={selectedDeleteDispatch}
      />

      {/* Footer */}
      <Footer company={company} />
    </div>
  );
}
