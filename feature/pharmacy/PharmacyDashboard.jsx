import React, { useState, useEffect } from 'react';
import './pharmacy.css';
import { INITIAL_MEDICINES, INITIAL_PRESCRIPTIONS, INITIAL_SUPPLIERS, INITIAL_PURCHASE_ORDERS, INITIAL_SALES_INVOICES, INITIAL_CUSTOMER_ORDERS, INITIAL_RETURNS, INITIAL_NOTIFICATIONS } from './data/mockPharmacyData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { MedicineInventory } from './components/MedicineInventory';
import { MedicineCategories } from './components/MedicineCategories';
import { PrescriptionManagement } from './components/PrescriptionManagement';
import { DispensingManagement } from './components/DispensingManagement';
import { StockAlerts } from './components/StockAlerts';
import { ExpiryTracker } from './components/ExpiryTracker';
import { OrderManagement } from './components/OrderManagement';
import { SupplierManagement } from './components/SupplierManagement';
import { PurchaseOrders } from './components/PurchaseOrders';
import { SalesAndBilling } from './components/SalesAndBilling';
import { ReturnsManagement } from './components/ReturnsManagement';
import { ReportsAndAnalytics } from './components/ReportsAndAnalytics';
import { NotificationsView } from './components/NotificationsView';
import { PharmacySettings } from './components/PharmacySettings';
import { AuthPage } from './components/AuthPage';
import { ProfileUpdate } from './components/ProfileUpdate';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { getCurrentUser, logoutUser, loadMedicines, saveMedicines, loadPrescriptions, savePrescriptions, loadSuppliers, saveSuppliers, loadPurchaseOrders, savePurchaseOrders, loadSalesInvoices, saveSalesInvoices, loadCustomerOrders, saveCustomerOrders, loadReturns, saveReturns, loadNotifications, saveNotifications } from './database/pharmacyDB';

export const PharmacyDashboard = () => {
    const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDoctorModal, setShowDoctorModal] = useState(false);

    // Primary Domain States initialized with DB or Mock fallbacks
    const [medicines, setMedicines] = useState(() => {
        const loaded = loadMedicines();
        return loaded.length > 0 ? loaded : INITIAL_MEDICINES;
    });
    const [prescriptions, setPrescriptions] = useState(() => {
        const loaded = loadPrescriptions();
        return loaded.length > 0 ? loaded : INITIAL_PRESCRIPTIONS;
    });
    const [suppliers, setSuppliers] = useState(() => {
        const loaded = loadSuppliers();
        return loaded.length > 0 ? loaded : INITIAL_SUPPLIERS;
    });
    const [purchaseOrders, setPurchaseOrders] = useState(() => {
        const loaded = loadPurchaseOrders();
        return loaded.length > 0 ? loaded : INITIAL_PURCHASE_ORDERS;
    });
    const [invoices, setInvoices] = useState(() => {
        const loaded = loadSalesInvoices();
        return loaded.length > 0 ? loaded : INITIAL_SALES_INVOICES;
    });
    const [orders, setOrders] = useState(() => {
        const loaded = loadCustomerOrders();
        return loaded.length > 0 ? loaded : INITIAL_CUSTOMER_ORDERS;
    });
    const [returns, setReturns] = useState(() => {
        const loaded = loadReturns();
        return loaded.length > 0 ? loaded : INITIAL_RETURNS;
    });
    const [notifications, setNotifications] = useState(() => {
        const loaded = loadNotifications();
        return loaded.length > 0 ? loaded : INITIAL_NOTIFICATIONS;
    });

    // Sync state changes back to LocalStorage Database automatically
    useEffect(() => { saveMedicines(medicines); }, [medicines]);
    useEffect(() => { savePrescriptions(prescriptions); }, [prescriptions]);
    useEffect(() => { saveSuppliers(suppliers); }, [suppliers]);
    useEffect(() => { savePurchaseOrders(purchaseOrders); }, [purchaseOrders]);
    useEffect(() => { saveSalesInvoices(invoices); }, [invoices]);
    useEffect(() => { saveCustomerOrders(orders); }, [orders]);
    useEffect(() => { saveReturns(returns); }, [returns]);
    useEffect(() => { saveNotifications(notifications); }, [notifications]);

    // Selected state for workflow navigation
    const [selectedRxForDispense, setSelectedRxForDispense] = useState(null);

    // Computed Metrics
    const lowStockCount = medicines.filter(m => m.availableQuantity <= m.reorderLevel).length;
    const pendingPrescriptionsCount = prescriptions.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;
    const todaySalesAmount = invoices.reduce((sum, i) => sum + i.grandTotal, 0);
    const now = new Date();
    const expiringCount = medicines.filter(m => {
        const exp = new Date(m.expiryDate);
        const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 90;
    }).length;
    const expiredCount = medicines.filter(m => new Date(m.expiryDate) <= now).length;
    const unreadNotifsCount = notifications.filter(n => !n.read).length;
    const metrics = {
        totalMedicines: medicines.length,
        lowStockCount,
        pendingPrescriptionsCount,
        todaySalesAmount,
        expiringSoonCount: expiringCount,
        expiredCount,
        pendingOrdersCount: orders.filter(o => o.orderStatus !== 'Completed').length
    };

    // Medicine Inventory Handlers
    const handleAddMedicine = (med) => {
        setMedicines(prev => [med, ...prev]);
        setNotifications(prev => [
            {
                id: `NOTIF-${Date.now()}`,
                title: 'New SKU Created',
                description: `${med.name} (${med.id}) added to active inventory registry.`,
                timestamp: 'Just now',
                type: 'stock',
                read: false,
                priority: 'low'
            },
            ...prev
        ]);
    };

    const handleUpdateMedicine = (med) => {
        setMedicines(prev => prev.map(m => m.id === med.id ? med : m));
    };

    const handleDeleteMedicine = (id) => {
        setMedicines(prev => prev.filter(m => m.id !== id));
    };

    const handleDeactivateExpiredBatch = (id) => {
        setMedicines(prev => prev.map(m => m.id === id ? { ...m, status: 'Inactive', availableQuantity: 0 } : m));
        setNotifications(prev => [
            {
                id: `NOTIF-${Date.now()}`,
                title: 'Batch Quarantined',
                description: `Medicine batch ${id} has been deactivated and quarantined.`,
                timestamp: 'Just now',
                type: 'expiry',
                read: false,
                priority: 'high'
            },
            ...prev
        ]);
    };

    // Prescription Handlers
    const handleUpdatePrescriptionStatus = (id, status, notes) => {
        setPrescriptions(prev => prev.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    status,
                    pharmacistNotes: notes !== undefined ? notes : p.pharmacistNotes
                };
            }
            return p;
        }));
    };

    const handleProceedToDispense = (rx) => {
        setSelectedRxForDispense(rx);
        setActiveTab('dispensing');
    };

    const handleCompleteDispensing = (rxId, dispensedItems, invoice) => {
        setPrescriptions(prev => prev.map(p => p.id === rxId ? { ...p, status: 'Dispensed' } : p));
        setMedicines(prev => prev.map(m => {
            const match = dispensedItems.find(i => i.medicineId === m.id || m.name.includes(i.medicineId));
            if (match) {
                const newQty = Math.max(0, m.availableQuantity - match.qty);
                return { ...m, availableQuantity: newQty };
            }
            return m;
        }));
        setInvoices(prev => [invoice, ...prev]);
        setNotifications(prev => [
            {
                id: `NOTIF-${Date.now()}`,
                title: 'Prescription Dispensed',
                description: `Prescription ${rxId} dispensed & stock updated automatically.`,
                timestamp: 'Just now',
                type: 'prescription',
                read: false,
                priority: 'medium'
            },
            ...prev
        ]);
    };

    // Counter Sales Handler
    const handleCompleteSale = (invoice, itemsToDeduct) => {
        setInvoices(prev => [invoice, ...prev]);
        setMedicines(prev => prev.map(m => {
            const match = itemsToDeduct.find(i => i.medicineId === m.id);
            if (match) {
                return { ...m, availableQuantity: Math.max(0, m.availableQuantity - match.qty) };
            }
            return m;
        }));
    };

    // Supplier & PO Handlers
    const handleAddSupplier = (sup) => {
        setSuppliers(prev => [...prev, sup]);
    };

    const handleUpdateSupplier = (sup) => {
        setSuppliers(prev => prev.map(s => s.id === sup.id ? sup : s));
    };

    const handleCreatePO = (po) => {
        setPurchaseOrders(prev => [po, ...prev]);
    };

    const handleReceivePOStock = (poId) => {
        const targetPO = purchaseOrders.find(p => p.id === poId);
        if (!targetPO || targetPO.status === 'Received') return;
        setPurchaseOrders(prev => prev.map(p => p.id === poId ? { ...p, status: 'Received' } : p));
        setMedicines(prev => prev.map(m => {
            const item = targetPO.items.find(i => i.medicineId === m.id || m.name.includes(i.medicineName));
            if (item) {
                return { ...m, availableQuantity: m.availableQuantity + item.quantityOrdered };
            }
            return m;
        }));
    };

    // Customer Orders Handler
    const handleUpdateOrderStatus = (orderId, status) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
    };

    // Returns Handler
    const handleAddReturn = (ret) => {
        setReturns(prev => [ret, ...prev]);
    };

    const handleApproveReturn = (id) => {
        setReturns(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    };

    // Notification Handlers
    const handleMarkAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleClearAll = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleTabChange = (tab) => {
        if (tab === 'logout') {
            logoutUser();
            setCurrentUser(null);
            setActiveTab('dashboard');
        } else {
            setActiveTab(tab);
        }
    };

    if (!currentUser) {
        return <AuthPage onAuthSuccess={(user) => { setCurrentUser(user); setActiveTab('dashboard'); }} />;
    }

    return (
        <div className="pharmacy-layout">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                pendingPrescriptionsCount={pendingPrescriptionsCount}
                lowStockCount={lowStockCount}
                expiringCount={expiringCount}
                unreadNotifsCount={unreadNotifsCount}
                currentUser={currentUser}
                onOpenProfileModal={() => setShowDoctorModal(true)}
            />

            <main className="pharmacy-main">
                <Header
                    notifications={notifications}
                    onNotificationClick={() => setActiveTab('notifications')}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    currentUser={currentUser}
                    onOpenProfileModal={() => setShowDoctorModal(true)}
                    onNavigateProfile={() => setActiveTab('profile')}
                />

                <div className="pharmacy-body">
                    {activeTab === 'dashboard' && (
                        <DashboardOverview
                            medicines={medicines}
                            prescriptions={prescriptions}
                            orders={orders}
                            notifications={notifications}
                            metrics={metrics}
                            onNavigate={setActiveTab}
                            onSelectPrescription={handleProceedToDispense}
                        />
                    )}

                    {activeTab === 'inventory' && (
                        <MedicineInventory
                            medicines={medicines}
                            suppliers={suppliers}
                            onAddMedicine={handleAddMedicine}
                            onUpdateMedicine={handleUpdateMedicine}
                            onDeleteMedicine={handleDeleteMedicine}
                        />
                    )}

                    {activeTab === 'categories' && (
                        <MedicineCategories
                            medicines={medicines}
                            onSelectCategory={() => setActiveTab('inventory')}
                        />
                    )}

                    {activeTab === 'prescriptions' && (
                        <PrescriptionManagement
                            prescriptions={prescriptions}
                            medicines={medicines}
                            onUpdatePrescriptionStatus={handleUpdatePrescriptionStatus}
                            onProceedToDispense={handleProceedToDispense}
                        />
                    )}

                    {activeTab === 'dispensing' && (
                        <DispensingManagement
                            prescriptions={prescriptions}
                            medicines={medicines}
                            selectedPrescriptionForDispensing={selectedRxForDispense}
                            onCompleteDispensing={handleCompleteDispensing}
                        />
                    )}

                    {activeTab === 'stock-alerts' && (
                        <StockAlerts
                            medicines={medicines}
                            onCreatePO={() => setActiveTab('purchase-orders')}
                        />
                    )}

                    {activeTab === 'expiry-tracker' && (
                        <ExpiryTracker
                            medicines={medicines}
                            onDeactivateExpiredBatch={handleDeactivateExpiredBatch}
                        />
                    )}

                    {activeTab === 'orders' && (
                        <OrderManagement
                            orders={orders}
                            onUpdateOrderStatus={handleUpdateOrderStatus}
                        />
                    )}

                    {activeTab === 'suppliers' && (
                        <SupplierManagement
                            suppliers={suppliers}
                            onAddSupplier={handleAddSupplier}
                            onUpdateSupplier={handleUpdateSupplier}
                        />
                    )}

                    {activeTab === 'purchase-orders' && (
                        <PurchaseOrders
                            purchaseOrders={purchaseOrders}
                            suppliers={suppliers}
                            medicines={medicines}
                            onCreatePO={handleCreatePO}
                            onReceivePOStock={handleReceivePOStock}
                        />
                    )}

                    {activeTab === 'sales-billing' && (
                        <SalesAndBilling
                            medicines={medicines}
                            invoices={invoices}
                            onCompleteSale={handleCompleteSale}
                        />
                    )}

                    {activeTab === 'returns' && (
                        <ReturnsManagement
                            returns={returns}
                            onAddReturn={handleAddReturn}
                            onApproveReturn={handleApproveReturn}
                        />
                    )}

                    {activeTab === 'reports' && (
                        <ReportsAndAnalytics
                            medicines={medicines}
                            prescriptions={prescriptions}
                            invoices={invoices}
                            purchaseOrders={purchaseOrders}
                            returns={returns}
                        />
                    )}

                    {activeTab === 'notifications' && (
                        <NotificationsView
                            notifications={notifications}
                            onMarkAsRead={handleMarkAsRead}
                            onClearAll={handleClearAll}
                        />
                    )}

                    {activeTab === 'profile' && (
                        <ProfileUpdate
                            user={currentUser}
                            onUserUpdate={(updatedUser) => setCurrentUser(updatedUser)}
                        />
                    )}

                    {activeTab === 'settings' && <PharmacySettings />}
                </div>
            </main>

            {/* Doctor Full Profile Modal */}
            {showDoctorModal && (
                <DoctorProfileModal
                    user={currentUser}
                    onClose={() => setShowDoctorModal(false)}
                    onEditProfile={() => {
                        setShowDoctorModal(false);
                        setActiveTab('profile');
                    }}
                    onLogout={() => {
                        setShowDoctorModal(false);
                        handleTabChange('logout');
                    }}
                />
            )}
        </div>
    );
};

export default PharmacyDashboard;
