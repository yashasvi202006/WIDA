import React, { useState, useEffect } from 'react';
import { labApiClient } from '../services/labApiClient.js';
import { Modal } from '../components/Modal.jsx';
import {
    BookOpen,
    Search,
    Plus,
    Tag,
    Clock,
    FileText,
    CheckCircle,
    Archive,
    Package,
    ShieldAlert
} from 'lucide-react';

export const TestCatalogue = ({ user, onShowToast }) => {
    const [tests, setTests] = useState([]);
    const [packages, setPackages] = useState([]);
    const [activeTab, setActiveTab] = useState('tests'); // 'tests' or 'packages'
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        category: 'Biochemistry',
        specimenType: 'Serum (Gold / Red Top)',
        price: '',
        turnaroundTime: '6 Hours',
        preparationInstructions: 'Overnight 10-12 hours fasting required.',
        normalRangeSummary: 'Physiological reference ranges apply.'
    });

    const categories = ['All', 'Hematology', 'Biochemistry', 'Pathology', 'Endocrinology', 'Microbiology'];

    const canManageCatalogue = user?.role === 'LAB_DIRECTOR' || user?.role === 'PATHOLOGIST';

    const fetchCatalogue = async () => {
        setIsLoading(true);
        try {
            const data = await labApiClient.getCatalogue({
                category: selectedCategory === 'All' ? '' : selectedCategory,
                search: searchQuery
            });
            setTests(data.tests || []);

            const pkgData = await labApiClient.getPackages();
            setPackages(pkgData.packages || []);
        } catch (err) {
            onShowToast?.('error', 'Failed to load test catalogue: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCatalogue();
    }, [selectedCategory, searchQuery]);

    const handleCreateTest = async (e) => {
        e.preventDefault();
        if (!formData.code || !formData.name || !formData.price) {
            onShowToast?.('error', 'Please enter test code, name, and valid price');
            return;
        }

        try {
            await labApiClient.addCatalogueTest({
                code: formData.code,
                name: formData.name,
                category: formData.category,
                specimenType: formData.specimenType,
                price: parseFloat(formData.price),
                turnaroundTime: formData.turnaroundTime,
                preparationInstructions: formData.preparationInstructions,
                normalRangeSummary: formData.normalRangeSummary
            });

            onShowToast?.('success', `Test ${formData.name} added to diagnostic catalogue`);
            setIsAddModalOpen(false);
            setFormData({
                code: '',
                name: '',
                category: 'Biochemistry',
                specimenType: 'Serum (Gold / Red Top)',
                price: '',
                turnaroundTime: '6 Hours',
                preparationInstructions: 'Overnight 10-12 hours fasting required.',
                normalRangeSummary: 'Physiological reference ranges apply.'
            });
            fetchCatalogue();
        } catch (err) {
            onShowToast?.('error', 'Error adding test: ' + err.message);
        }
    };

    const handleToggleArchive = async (testId, currentActive) => {
        if (!canManageCatalogue) {
            onShowToast?.('error', 'Security Gate: Only the Lab Director can archive catalogue services');
            return;
        }

        try {
            await labApiClient.archiveCatalogueTest(testId);
            onShowToast?.('success', 'Catalogue entry updated successfully');
            fetchCatalogue();
        } catch (err) {
            onShowToast?.('error', 'Failed to update test: ' + err.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header and Controls */}
            <div className="lab-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lab-text-main)', margin: 0 }}>
                            Diagnostic Test & Package Catalogue
                        </h2>
                        <span style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)' }}>
                            Manage laboratory test specifications, turnaround times, and pricing
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {canManageCatalogue && (
                            <button
                                type="button"
                                className="lab-btn lab-btn-primary"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                <Plus size={16} /> Add Diagnostic Test
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs: Individual Tests vs Health Packages */}
                <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--lab-border)', paddingBottom: '0.75rem' }}>
                    <button
                        type="button"
                        className={`lab-btn lab-btn-sm ${activeTab === 'tests' ? 'lab-btn-primary' : 'lab-btn-outline'}`}
                        onClick={() => setActiveTab('tests')}
                    >
                        <BookOpen size={14} /> Individual Diagnostic Tests ({tests.length})
                    </button>
                    <button
                        type="button"
                        className={`lab-btn lab-btn-sm ${activeTab === 'packages' ? 'lab-btn-primary' : 'lab-btn-outline'}`}
                        onClick={() => setActiveTab('packages')}
                    >
                        <Package size={14} /> Full-Body Checkup Packages ({packages.length})
                    </button>
                </div>

                {activeTab === 'tests' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                        {/* Category filter pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`lab-btn lab-btn-sm ${(selectedCategory === cat || (!selectedCategory && cat === 'All')) ? 'lab-btn-primary' : 'lab-btn-outline'}`}
                                    onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                                    style={{ fontSize: '0.78rem' }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div style={{ position: 'relative', minWidth: '260px' }}>
                            <input
                                type="text"
                                className="lab-input"
                                style={{ paddingLeft: '2.4rem', height: '36px', fontSize: '0.84rem' }}
                                placeholder="Search test name or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Content Tab: Individual Tests Table */}
            {activeTab === 'tests' && (
                <div className="lab-card">
                    <div className="lab-table-container">
                        <table className="lab-table">
                            <thead>
                                <tr>
                                    <th>Code / Test Name</th>
                                    <th>Category</th>
                                    <th>Specimen Type</th>
                                    <th>Turnaround</th>
                                    <th>Patient Instructions</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    {canManageCatalogue && <th style={{ textAlign: 'right' }}>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {tests.length === 0 ? (
                                    <tr>
                                        <td colSpan={canManageCatalogue ? 8 : 7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--lab-text-secondary)' }}>
                                            No diagnostic tests found matching filters.
                                        </td>
                                    </tr>
                                ) : (
                                    tests.map(t => (
                                        <tr key={t.id}>
                                            <td>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                                                <span style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)', fontFamily: 'var(--lab-font-mono)' }}>
                                                    {t.code}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="lab-badge lab-badge-teal" style={{ fontSize: '0.7rem' }}>
                                                    {t.category}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)' }}>
                                                {t.specimen_type}
                                            </td>
                                            <td>
                                                <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                                                    <Clock size={13} style={{ color: 'var(--lab-primary)' }} />
                                                    {t.turnaround_time}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.78rem', maxWidth: '240px', color: 'var(--lab-text-secondary)', lineHeight: 1.3 }}>
                                                {t.preparation_instructions}
                                            </td>
                                            <td style={{ fontWeight: 800, color: 'var(--lab-primary-dark)', fontSize: '0.95rem' }}>
                                                ₹{parseFloat(t.price).toFixed(2)}
                                            </td>
                                            <td>
                                                <span className={`lab-badge ${t.is_active ? 'lab-badge-success' : 'lab-badge-danger'}`} style={{ fontSize: '0.68rem' }}>
                                                    {t.is_active ? 'ACTIVE' : 'ARCHIVED'}
                                                </span>
                                            </td>
                                            {canManageCatalogue && (
                                                <td style={{ textAlign: 'right' }}>
                                                    <button
                                                        type="button"
                                                        className="lab-btn lab-btn-outline lab-btn-sm"
                                                        onClick={() => handleToggleArchive(t.id, t.is_active)}
                                                        title="Archive or toggle test status"
                                                    >
                                                        <Archive size={13} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Content Tab: Health Packages Grid */}
            {activeTab === 'packages' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {packages.map(pkg => (
                        <div key={pkg.id} className="lab-card lab-card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--lab-text-main)' }}>
                                        {pkg.name}
                                    </h3>
                                    <span className="lab-badge lab-badge-teal">{pkg.code}</span>
                                </div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)', lineHeight: 1.45, marginBottom: '1rem' }}>
                                    {pkg.description}
                                </p>

                                <div style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lab-text-secondary)', textTransform: 'uppercase' }}>
                                        INCLUDED CLINICAL INVESTIGATIONS ({pkg.includedTests?.length || 0}):
                                    </span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                                        {(pkg.includedTests || []).map(t => (
                                            <span key={t.id} style={{ fontSize: '0.72rem', backgroundColor: 'var(--lab-surface-muted)', border: '1px solid var(--lab-border)', padding: '0.2rem 0.5rem', borderRadius: 'var(--lab-radius-sm)', color: 'var(--lab-text-main)' }}>
                                                {t.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--lab-border)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--lab-text-muted)' }}>
                                        ₹{pkg.original_price}
                                    </span>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lab-primary-dark)' }}>
                                        ₹{pkg.price}
                                    </div>
                                </div>
                                <span className="lab-badge lab-badge-success">
                                    Full Body Preventive
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Diagnostic Test Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Diagnostic Test to Catalogue"
                maxWidth={620}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
                        <button type="button" className="lab-btn lab-btn-outline" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="button" className="lab-btn lab-btn-primary" onClick={handleCreateTest}>
                            Save & Publish Test
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleCreateTest}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                        <div className="lab-form-group">
                            <label className="lab-label">Test Code *</label>
                            <input
                                type="text"
                                className="lab-input"
                                placeholder="e.g. BIO-LIPID"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                        </div>
                        <div className="lab-form-group">
                            <label className="lab-label">Diagnostic Test Name *</label>
                            <input
                                type="text"
                                className="lab-input"
                                placeholder="e.g. Lipid Profile Panel"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="lab-form-group">
                            <label className="lab-label">Department / Category</label>
                            <select
                                className="lab-select"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Biochemistry">Biochemistry</option>
                                <option value="Hematology">Hematology</option>
                                <option value="Pathology">Pathology</option>
                                <option value="Endocrinology">Endocrinology</option>
                                <option value="Microbiology">Microbiology</option>
                                <option value="Immunology">Immunology</option>
                            </select>
                        </div>
                        <div className="lab-form-group">
                            <label className="lab-label">Specimen / Tube Type</label>
                            <input
                                type="text"
                                className="lab-input"
                                placeholder="e.g. Serum (Gold Top) / EDTA Blood"
                                value={formData.specimenType}
                                onChange={(e) => setFormData({ ...formData, specimenType: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="lab-form-group">
                            <label className="lab-label">Test Price (₹) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="lab-input"
                                placeholder="650.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="lab-form-group">
                            <label className="lab-label">Expected Turnaround Time (TAT)</label>
                            <input
                                type="text"
                                className="lab-input"
                                placeholder="e.g. 6 Hours / 24 Hours"
                                value={formData.turnaroundTime}
                                onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Preparation & Patient Instructions</label>
                        <textarea
                            rows={2}
                            className="lab-textarea"
                            placeholder="e.g. 10-12 hours overnight fasting mandatory. Plain water permitted."
                            value={formData.preparationInstructions}
                            onChange={(e) => setFormData({ ...formData, preparationInstructions: e.target.value })}
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};
