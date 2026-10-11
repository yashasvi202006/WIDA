/**
 * Authentication and RBAC Middleware for Lab Backend
 */

import { verifyToken } from '../utils/cryptoUtil.js';
import { labDb } from '../../database/db.js';

export function authenticate(req) {
    const authHeader = req.headers['authorization'] || '';
    if (!authHeader.startsWith('Bearer ')) {
        return { authenticated: false, error: 'Authorization token required', status: 401 };
    }

    const token = authHeader.substring(7).trim();
    const payload = verifyToken(token);
    if (!payload) {
        return { authenticated: false, error: 'Invalid or expired session token', status: 401 };
    }

    // Verify staff exists and is active
    let user = null;
    if (payload.staffId) {
        user = labDb.get('SELECT id, lab_id, full_name, email, role, is_active FROM lab_staff WHERE id = ?', [payload.staffId]);
    } else if (payload.labId) {
        const lab = labDb.get('SELECT id, name, email, status FROM labs WHERE id = ?', [payload.labId]);
        if (lab) {
            user = {
                id: 'director-' + lab.id,
                lab_id: lab.id,
                full_name: lab.name + ' (Director)',
                email: lab.email,
                role: 'LAB_DIRECTOR',
                is_active: lab.status === 'VERIFIED' ? 1 : 0
            };
        }
    }

    if (!user) {
        return { authenticated: false, error: 'User record not found', status: 401 };
    }

    return {
        authenticated: true,
        user: {
            id: user.id,
            labId: user.lab_id,
            name: user.full_name,
            email: user.email,
            role: user.role,
            isActive: Boolean(user.is_active)
        }
    };
}

export function authorizeRole(user, allowedRoles = []) {
    if (!user) return false;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
}
