// WIDA / WIDA — Doctor Module REST client (optional online mode)
// Falls back to local mock when the Java backend is unavailable.
const API_BASE = import.meta.env.VITE_DOCTOR_API_BASE ?? 'http://localhost:8081/api';
function mapProfileToDoctor(p) {
    return {
        id: p.id,
        fullName: p.fullName,
        email: p.email,
        phoneNumber: p.phoneNumber,
        gender: p.gender,
        dateOfBirth: p.dateOfBirth,
        medicalRegistrationNumber: p.medicalRegistrationNumber,
        qualification: p.qualification,
        specializationId: p.specializationId,
        specializationName: p.specializationName,
        subSpecialization: p.subSpecialization,
        yearsOfExperience: p.yearsOfExperience,
        hospitalClinicName: p.hospitalClinicName,
        address: p.address,
        city: p.city,
        state: p.state,
        pincode: p.pincode,
        consultationFee: Number(p.consultationFee),
        languagesKnown: p.languagesKnown,
        professionalBio: p.professionalBio,
        profilePhotoUrl: p.profilePhotoUrl,
        verificationStatus: p.verificationStatus,
        averageRating: Number(p.averageRating ?? 5),
        totalRatings: p.totalRatings ?? 0,
        totalPatients: p.totalPatients ?? 0,
        isActive: true,
    };
}
async function parseError(res) {
    try {
        const body = await res.json();
        if (body?.message)
            return String(body.message);
        if (body?.errors && typeof body.errors === 'object') {
            return Object.values(body.errors).join(' ');
        }
    }
    catch {
        // ignore
    }
    return `Request failed (${res.status})`;
}
export async function backendLogin(email, password) {
    try {
        const res = await fetch(`${API_BASE}/doctor/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            throw new Error(await parseError(res));
        }
        const auth = (await res.json());
        const profileRes = await fetch(`${API_BASE}/doctor/profile/${auth.id}`, {
            headers: { Accept: 'application/json' },
        });
        if (profileRes.ok) {
            return mapProfileToDoctor((await profileRes.json()));
        }
        return {
            id: auth.id,
            fullName: auth.fullName,
            email: auth.email,
            phoneNumber: auth.phoneNumber ?? '',
            gender: 'MALE',
            medicalRegistrationNumber: '',
            qualification: auth.qualification ?? '',
            specializationName: auth.specializationName ?? 'General Physician',
            yearsOfExperience: 0,
            hospitalClinicName: auth.hospitalClinicName ?? '',
            consultationFee: Number(auth.consultationFee ?? 0),
            profilePhotoUrl: auth.profilePhotoUrl,
            verificationStatus: auth.verificationStatus ?? 'PENDING',
            averageRating: 5,
            totalRatings: 0,
            totalPatients: 0,
            isActive: true,
        };
    }
    catch (err) {
        if (err instanceof TypeError) {
            return null;
        }
        throw err;
    }
}
export async function backendRegister(payload) {
    try {
        const res = await fetch(`${API_BASE}/doctor/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error(await parseError(res));
        }
        const auth = (await res.json());
        const profileRes = await fetch(`${API_BASE}/doctor/profile/${auth.id}`, {
            headers: { Accept: 'application/json' },
        });
        if (profileRes.ok) {
            return mapProfileToDoctor((await profileRes.json()));
        }
        return mapProfileToDoctor({
            id: auth.id,
            fullName: auth.fullName,
            email: auth.email,
            phoneNumber: auth.phoneNumber ?? '',
            gender: payload.gender ?? 'MALE',
            medicalRegistrationNumber: String(payload.medicalRegistrationNumber ?? ''),
            qualification: auth.qualification ?? String(payload.qualification ?? ''),
            specializationId: payload.specializationId,
            specializationName: auth.specializationName ?? String(payload.specializationName ?? ''),
            yearsOfExperience: Number(payload.yearsOfExperience ?? 0),
            hospitalClinicName: auth.hospitalClinicName ?? String(payload.hospitalClinicName ?? ''),
            consultationFee: Number(auth.consultationFee ?? payload.consultationFee ?? 0),
            profilePhotoUrl: auth.profilePhotoUrl,
            verificationStatus: auth.verificationStatus ?? 'PENDING',
        });
    }
    catch (err) {
        if (err instanceof TypeError) {
            return null;
        }
        throw err;
    }
}
export function isBackendConfigured() {
    return Boolean(API_BASE);
}
