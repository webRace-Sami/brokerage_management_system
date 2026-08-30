'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SummaryCards from '@/components/SummaryCards';
import GrandTotalsBar from '@/components/GrandTotalsBar';
import DispatchTable from '@/components/DispatchTable';
import NewDispatchModal from '@/components/NewDispatchModal';
import StockInwardModal from '@/components/StockInwardModal';
import StockRegistryModal from '@/components/StockRegistryModal';
import BiltyPrintModal from '@/components/BiltyPrintModal';
import EditDispatchModal from '@/components/EditDispatchModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import Footer from '@/components/Footer';
import {
  UserProfile,
  DashboardSummary,
  DispatchData,
  BrokerData,
  StockItemData,
} from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data States
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [dispatches, setDispatches] = useState<DispatchData[]>([]);
  const [brokers, setBrokers] = useState<BrokerData[]>([]);
  const [stockItems, setStockItems] = useState<StockItemData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Filters
  const [activeBrokerTab, setActiveBrokerTab] = useState('ALL');
  const [selectedRentFilter, setSelectedRentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState(false);
  const [isStockInwardOpen, setIsStockInwardOpen] = useState(false);
  const [isStockRegistryOpen, setIsStockRegistryOpen] = useState(false);
  const [selectedBiltyDispatch, setSelectedBiltyDispatch] = useState<DispatchData | null>(null);
  const [selectedEditDispatch, setSelectedEditDispatch] = useState<DispatchData | null>(null);
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
          // Check local storage fallback or redirect
          const stored = localStorage.getItem('madina_user');
          if (stored) {
            setCurrentUser(JSON.parse(stored));
          } else {
            router.push('/login');
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch Dashboard Summary, Brokers & Stock
  const fetchSummaryAndBrokers = useCallback(async () => {
    try {
      const [sumRes, brokRes, stockRes] = await Promise.all([
        fetch('/api/dashboard/summary'),
        fetch('/api/brokers'),
        fetch('/api/stock-items'),
      ]);

      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
      }

      if (brokRes.ok) {
        const brokData = await brokRes.json();
        setBrokers(brokData.brokers);
      }

      if (stockRes.ok) {
        const stockData = await stockRes.json();
        setStockItems(stockData.stockItems);
      }
    } catch (err) {
      console.error('Fetch summary error:', err);
    }
  }, []);

  // Fetch Dispatches List with active filters
  const fetchDispatches = useCallback(async () => {
    try {
      setDataLoading(true);
      const params = new URLSearchParams();
      if (activeBrokerTab !== 'ALL') params.append('brokerId', activeBrokerTab);
      if (selectedRentFilter !== 'ALL') params.append('rentStatus', selectedRentFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/dispatches?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDispatches(data.dispatches || []);
      }
    } catch (err) {
      console.error('Fetch dispatches error:', err);
    } finally {
      setDataLoading(false);
    }
  }, [activeBrokerTab, selectedRentFilter, searchQuery]);

  // Initial and reactive data fetching
  useEffect(() => {
    fetchSummaryAndBrokers();
  }, [fetchSummaryAndBrokers]);

  useEffect(() => {
    fetchDispatches();
  }, [fetchDispatches]);

  // Quick Rent Status Toggle
  const handleToggleRentStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/dispatches/${id}/toggle-rent`, {
        method: 'PATCH',
      });
      if (res.ok) {
        // Refresh dispatches and summary instantly
        fetchDispatches();
        fetchSummaryAndBrokers();
      }
    } catch (err) {
      console.error('Toggle rent error:', err);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const params = new URLSearchParams();
    if (activeBrokerTab !== 'ALL') params.append('brokerId', activeBrokerTab);
    if (selectedRentFilter !== 'ALL') params.append('rentStatus', selectedRentFilter);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    window.open(`/api/export-excel?${params.toString()}`, '_blank');
  };

  const handleRefreshAll = () => {
    fetchSummaryAndBrokers();
    fetchDispatches();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-sm font-semibold tracking-wide text-slate-300">
            Connecting to Madina Munshi Portal...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar user={currentUser} />

      {/* Main Dashboard Workspace */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Section 1: Main Broker & Co-Broker Summary Cards (Live Shared Inventory) */}
        <SummaryCards
          summary={summary}
          activeBrokerTab={activeBrokerTab}
          onSelectBrokerTab={(id) => setActiveBrokerTab(id)}
        />

        {/* Section 2: Fixed Cumulative Metrics Bar */}
        <GrandTotalsBar summary={summary} />

        {/* Section 3: Central Central Dispatch & Stock Data Table */}
        <DispatchTable
          dispatches={dispatches}
          loading={dataLoading}
          currentUser={currentUser}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          selectedRentFilter={selectedRentFilter}
          onRentFilterChange={(status) => setSelectedRentFilter(status)}
          onToggleRentStatus={handleToggleRentStatus}
          onOpenNewDispatch={() => setIsNewDispatchOpen(true)}
          onOpenStockInward={() => setIsStockInwardOpen(true)}
          onOpenStockRegistry={() => setIsStockRegistryOpen(true)}
          onPrintBilty={(dispatch) => setSelectedBiltyDispatch(dispatch)}
          onEditDispatch={(dispatch) => setSelectedEditDispatch(dispatch)}
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
      />

      <StockInwardModal
        isOpen={isStockInwardOpen}
        onClose={() => setIsStockInwardOpen(false)}
        onSuccess={handleRefreshAll}
        stockItems={stockItems}
      />

      <StockRegistryModal
        isOpen={isStockRegistryOpen}
        onClose={() => setIsStockRegistryOpen(false)}
        onSuccess={handleRefreshAll}
        stockItems={stockItems}
        currentUser={currentUser}
      />

      <BiltyPrintModal
        isOpen={!!selectedBiltyDispatch}
        onClose={() => setSelectedBiltyDispatch(null)}
        dispatch={selectedBiltyDispatch}
      />

      <EditDispatchModal
        isOpen={!!selectedEditDispatch}
        onClose={() => setSelectedEditDispatch(null)}
        onSuccess={handleRefreshAll}
        dispatch={selectedEditDispatch}
      />

      <DeleteConfirmModal
        isOpen={!!selectedDeleteDispatch}
        onClose={() => setSelectedDeleteDispatch(null)}
        onSuccess={handleRefreshAll}
        dispatch={selectedDeleteDispatch}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
