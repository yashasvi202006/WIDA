import React, { useState } from 'react';
import { doctorApi } from '../services/doctorApi.js';
export const DoctorRegister = ({ onRegisterSuccess, onGoToLogin, }) => {
    const specializations = doctorApi.getSpecializations();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        gender: 'MALE',
        dateOfBirth: '1990-01-01',
        medicalRegistrationNumber: '',
        qualification: '',
        specializationId: specializations[0]?.id || 1,
        specializationName: specializations[0]?.name || 'General Physician',
        subSpecialization: '',
        yearsOfExperience: 5,
        hospitalClinicName: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        consultationFee: 600,
        languagesKnown: 'English, Hindi',
        professionalBio: '',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
        verificationDocumentName: 'Medical_Council_Registration_Certificate.pdf',
        verificationDocumentType: 'State Medical Council Certificate',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'specializationId') {
            const spec = specializations.find((s) => s.id === Number(value));
            setFormData((prev) => ({
                ...prev,
                specializationId: Number(value),
                specializationName: spec ? spec.name : prev.specializationName,
            }));
        }
        else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === 'yearsOfExperience' || name === 'consultationFee' ? Number(value) : value,
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Validations
        if (!formData.fullName.trim()) {
            setError('Please enter your full name.');
            return;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!formData.phoneNumber.trim()) {
            setError('Please enter your phone number.');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Password and confirm password do not match.');
            return;
        }
        if (!formData.medicalRegistrationNumber.trim()) {
            setError('Medical registration number cannot be empty.');
            return;
        }
        if (!formData.qualification.trim()) {
            setError('Please provide your medical qualification (e.g., MBBS, MD).');
            return;
        }
        if (formData.yearsOfExperience < 0) {
            setError('Years of experience cannot be negative.');
            return;
        }
        if (formData.consultationFee < 0) {
            setError('Consultation fee cannot be negative.');
            return;
        }
        if (!formData.hospitalClinicName.trim()) {
            setError('Please provide your affiliated hospital or clinic name.');
            return;
        }
        setIsLoading(true);
        try {
            const doc = await doctorApi.register(formData);
            onRegisterSuccess(doc);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="doc-auth-container">
      <div className="doc-auth-card wide">
        <div className="doc-auth-header">
          <div className="doc-brand-badge">
            <span>🩺</span>
            <span>WIDA FINAL SEMESTER PROJECT - WIDA</span>
          </div>
          <h1>Doctor Practitioner Registration</h1>
          <p>Create your verified clinical provider account</p>
        </div>

        {error && (<div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: 'var(--doc-radius)',
                marginBottom: '20px',
                fontSize: '13.5px',
            }}>
            ⚠️ {error}
          </div>)}

        <form onSubmit={handleSubmit}>
          <div className="doc-form-grid">
            {/* Full Name */}
            <div className="doc-form-group">
              <label className="doc-label">
                Full Name with Title <span className="req">*</span>
              </label>
              <input type="text" name="fullName" className="doc-input" placeholder="Dr. Vanshika Tailor" value={formData.fullName} onChange={handleChange} required/>
            </div>

            {/* Email */}
            <div className="doc-form-group">
              <label className="doc-label">
                Email Address <span className="req">*</span>
              </label>
              <input type="email" name="email" className="doc-input" placeholder="dr.vanshika@wida.org" value={formData.email} onChange={handleChange} required/>
            </div>

            {/* Phone */}
            <div className="doc-form-group">
              <label className="doc-label">
                Contact Phone Number <span className="req">*</span>
              </label>
              <input type="text" name="phoneNumber" className="doc-input" placeholder="+91 98765 00000" value={formData.phoneNumber} onChange={handleChange} required/>
            </div>

            {/* Gender */}
            <div className="doc-form-group">
              <label className="doc-label">Gender</label>
              <select name="gender" className="doc-select" value={formData.gender} onChange={handleChange}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Password */}
            <div className="doc-form-group">
              <label className="doc-label">
                Create Password (Min 8 chars) <span className="req">*</span>
              </label>
              <input type="password" name="password" className="doc-input" placeholder="Doctor@123" value={formData.password} onChange={handleChange} required/>
            </div>

            {/* Confirm Password */}
            <div className="doc-form-group">
              <label className="doc-label">
                Confirm Password <span className="req">*</span>
              </label>
              <input type="password" name="confirmPassword" className="doc-input" placeholder="Doctor@123" value={formData.confirmPassword} onChange={handleChange} required/>
            </div>

            {/* Medical Registration Number */}
            <div className="doc-form-group">
              <label className="doc-label">
                Medical Registration Number <span className="req">*</span>
              </label>
              <input type="text" name="medicalRegistrationNumber" className="doc-input" placeholder="MCI-2024-99881" value={formData.medicalRegistrationNumber} onChange={handleChange} required/>
              <span className="doc-hint">National / State Medical Council License</span>
            </div>

            {/* Qualification */}
            <div className="doc-form-group">
              <label className="doc-label">
                Qualification Degrees <span className="req">*</span>
              </label>
              <input type="text" name="qualification" className="doc-input" placeholder="MBBS, MD, MS" value={formData.qualification} onChange={handleChange} required/>
            </div>

            {/* 30 Specializations Selector */}
            <div className="doc-form-group">
              <label className="doc-label">
                Medical Specialization (30+ Supported) <span className="req">*</span>
              </label>
              <select name="specializationId" className="doc-select" value={formData.specializationId} onChange={handleChange}>
                {specializations.map((s) => (<option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>))}
              </select>
            </div>

            {/* Sub-Specialization */}
            <div className="doc-form-group">
              <label className="doc-label">Sub-Specialization (Optional)</label>
              <input type="text" name="subSpecialization" className="doc-input" placeholder="e.g. Clinical Electrophysiology" value={formData.subSpecialization} onChange={handleChange}/>
            </div>

            {/* Experience */}
            <div className="doc-form-group">
              <label className="doc-label">
                Years of Clinical Experience <span className="req">*</span>
              </label>
              <input type="number" name="yearsOfExperience" min="0" className="doc-input" value={formData.yearsOfExperience} onChange={handleChange} required/>
            </div>

            {/* Consultation Fee */}
            <div className="doc-form-group">
              <label className="doc-label">
                Consultation Fee (₹) <span className="req">*</span>
              </label>
              <input type="number" name="consultationFee" min="0" className="doc-input" value={formData.consultationFee} onChange={handleChange} required/>
            </div>

            {/* Hospital/Clinic Name */}
            <div className="doc-form-group full-width">
              <label className="doc-label">
                Primary Hospital / Clinic Facility <span className="req">*</span>
              </label>
              <input type="text" name="hospitalClinicName" className="doc-input" placeholder="Apollo Multi-Specialty Clinic / Fortis Hospital" value={formData.hospitalClinicName} onChange={handleChange} required/>
            </div>

            {/* Address */}
            <div className="doc-form-group full-width">
              <label className="doc-label">Clinic Address</label>
              <input type="text" name="address" className="doc-input" placeholder="Street address, Suite / Floor" value={formData.address} onChange={handleChange}/>
            </div>

            {/* City */}
            <div className="doc-form-group">
              <label className="doc-label">City</label>
              <input type="text" name="city" className="doc-input" placeholder="Mumbai / Delhi" value={formData.city} onChange={handleChange}/>
            </div>

            {/* State & Pincode */}
            <div className="doc-form-group">
              <label className="doc-label">State & Pincode</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" name="state" className="doc-input" placeholder="State" value={formData.state} onChange={handleChange}/>
                <input type="text" name="pincode" className="doc-input" style={{ width: '120px' }} placeholder="Pin" value={formData.pincode} onChange={handleChange}/>
              </div>
            </div>

            {/* Languages */}
            <div className="doc-form-group">
              <label className="doc-label">Languages Known</label>
              <input type="text" name="languagesKnown" className="doc-input" placeholder="English, Hindi, Marathi" value={formData.languagesKnown} onChange={handleChange}/>
            </div>

            {/* Verification Document simulation */}
            <div className="doc-form-group">
              <label className="doc-label">Medical Verification Document</label>
              <input type="text" name="verificationDocumentName" className="doc-input" value={formData.verificationDocumentName} onChange={handleChange}/>
              <span className="doc-hint">Simulated upload: PDF / Image certificate</span>
            </div>

            {/* Professional Bio */}
            <div className="doc-form-group full-width">
              <label className="doc-label">Professional Summary / Bio</label>
              <textarea name="professionalBio" rows={3} className="doc-textarea" placeholder="Provide a short overview of your clinical focus, achievements, and approach to patient care..." value={formData.professionalBio} onChange={handleChange}/>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="doc-btn doc-btn-outline doc-btn-lg" onClick={onGoToLogin}>
              Cancel & Return to Login
            </button>
            <button type="submit" className="doc-btn doc-btn-primary doc-btn-lg" disabled={isLoading}>
              {isLoading ? 'Creating Provider Account...' : 'Complete Doctor Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>);
};
