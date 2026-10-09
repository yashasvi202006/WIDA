import React, { useState } from 'react';
import { PATIENT_MOCK_DOCUMENTS } from '../data/patientMockData';
import type { PatientMedicalDocument } from '../types/patientTypes';
import { FolderLock, Upload, FileText, Download, Trash2 } from 'lucide-react';

export const PatientMedicalVault: React.FC = () => {
  const [documents, setDocuments] = useState<PatientMedicalDocument[]>(PATIENT_MOCK_DOCUMENTS);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = ['All', 'Medical Reports', 'Vaccination', 'Insurance', 'Prescriptions'];

  const filtered = documents.filter((d) => (categoryFilter === 'All' ? true : d.category === categoryFilter));

  const handleSimulateUpload = () => {
    const newDoc: PatientMedicalDocument = {
      id: `doc-${Date.now()}`,
      title: 'Echo Doppler Cardiac Evaluation 2026',
      category: 'Medical Reports',
      date: 'Today',
      fileSize: '3.2 MB',
      uploader: 'Yashasvi Saini (Self)',
      sharingStatus: 'Shared with Doctors',
      fileType: 'pdf'
    };
    setDocuments([newDoc, ...documents]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  return (
    <div className="patient-medical-vault d-flex flex-column gap-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h3 className="font-heading mb-1">Encrypted Medical Document Vault</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Store, categorize, and control external medical files, historical records, and policy documents
          </p>
        </div>

        <button className="patient-btn patient-btn-primary" onClick={handleSimulateUpload}>
          <Upload size={14} /> {uploadSuccess ? 'Document Uploaded!' : 'Upload Health Document'}
        </button>
      </div>

      {/* Security Banner */}
      <div className="p-3 rounded border d-flex align-items-center justify-content-between" style={{ backgroundColor: 'var(--p-surface)', borderColor: 'var(--p-border)' }}>
        <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.82rem' }}>
          <FolderLock size={18} style={{ color: 'var(--p-primary)' }} />
          <span>
            <strong>Zero-Knowledge Client Encryption:</strong> Uploaded medical assets are AES-256 encrypted before cloud archiving.
          </span>
        </div>
        <span className="patient-badge patient-badge-teal">HIPAA & ABDM Compliant</span>
      </div>

      {/* Category Tabs */}
      <div className="patient-card p-3 d-flex flex-wrap gap-1">
        {categories.map((c) => (
          <button
            key={c}
            className={`patient-btn patient-btn-sm ${categoryFilter === c ? 'patient-btn-primary' : 'patient-btn-outline'}`}
            onClick={() => setCategoryFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="row g-3">
        {filtered.map((doc) => (
          <div key={doc.id} className="col-md-6 col-lg-4">
            <div className="patient-card p-3 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--p-radius-md)',
                      backgroundColor: 'var(--p-surface-alt)',
                      color: 'var(--p-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FileText size={20} />
                  </div>
                  <span className="patient-badge patient-badge-neutral">{doc.fileType.toUpperCase()}</span>
                </div>

                <h6 className="font-heading mb-1 text-truncate" title={doc.title} style={{ fontSize: '0.92rem' }}>
                  {doc.title}
                </h6>

                <div className="d-flex align-items-center gap-2 text-muted mb-2" style={{ fontSize: '0.78rem' }}>
                  <span>{doc.date}</span>
                  <span>•</span>
                  <span>{doc.fileSize}</span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--p-text-muted)' }} className="mb-2">
                  Uploaded by: <strong>{doc.uploader}</strong>
                </div>

                <span className="patient-badge patient-badge-teal mb-2" style={{ fontSize: '0.7rem' }}>
                  {doc.sharingStatus}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'var(--p-border-subtle)' }}>
                <button
                  className="patient-btn patient-btn-outline patient-btn-sm"
                  onClick={() => alert(`Downloading document: ${doc.title}`)}
                >
                  <Download size={13} />
                </button>
                <button
                  className="patient-btn patient-btn-outline patient-btn-sm text-danger"
                  style={{ borderColor: 'var(--p-danger)', color: 'var(--p-danger)' }}
                  onClick={() => handleDelete(doc.id)}
                  title="Delete from vault"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
