/**
 * Security & Cryptography Utilities for Lab Module
 * Uses standard Node.js crypto (PBKDF2 with SHA-512, timing-safe equality, random salts)
 */

import crypto from 'node:crypto';

const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = 'sha512';
const TOKEN_SECRET = process.env.LAB_JWT_SECRET || 'wida-lab-production-secure-key-2026';

export function hashPassword(password) {
    if (!password || typeof password !== 'string') {
        throw new Error('Password must be a non-empty string');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST);
    return `pbkdf2$${ITERATIONS}$${salt}$${derivedKey.toString('hex')}`;
}

export function verifyPassword(password, storedHash) {
    if (!password || !storedHash) return false;
    try {
        const parts = storedHash.split('$');
        if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
            // Fallback for simple demo hash check if needed
            return false;
        }
        const iterations = parseInt(parts[1], 10);
        const salt = parts[2];
        const originalHash = parts[3];

        const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, KEY_LEN, DIGEST);
        const derivedHash = derivedKey.toString('hex');

        const originalBuffer = Buffer.from(originalHash, 'hex');
        const derivedBuffer = Buffer.from(derivedHash, 'hex');

        if (originalBuffer.length !== derivedBuffer.length) {
            return false;
        }
        return crypto.timingSafeEqual(originalBuffer, derivedBuffer);
    } catch {
        return false;
    }
}

export function generateToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const issuedAt = Date.now();
    const expiresAt = issuedAt + (24 * 60 * 60 * 1000); // 24 hours
    const claims = Buffer.from(JSON.stringify({ ...payload, iat: issuedAt, exp: expiresAt })).toString('base64url');
    const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(`${header}.${claims}`).digest('base64url');
    return `${header}.${claims}.${signature}`;
}

export function verifyToken(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, claims, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(`${header}.${claims}`).digest('base64url');
    
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return null;
    }

    try {
        const decoded = JSON.parse(Buffer.from(claims, 'base64url').toString('utf-8'));
        if (decoded.exp && Date.now() > decoded.exp) {
            return null; // Expired
        }
        return decoded;
    } catch {
        return null;
    }
}
