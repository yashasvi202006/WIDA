import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PharmacyDashboard from './PharmacyDashboard';
import './pharmacy.css';
createRoot(document.getElementById('root')).render(<StrictMode>
    <PharmacyDashboard />
  </StrictMode>);
