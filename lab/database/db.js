/**
 * Isolated SQLite Relational Database Engine for WIDA Lab Module
 * Uses Node 24 native node:sqlite.
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE_PATH = path.resolve(__dirname, 'lab.db');
const SCHEMA_FILE_PATH = path.resolve(__dirname, 'schema.sql');

class LabDatabase {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        try {
            const dbDir = path.dirname(DB_FILE_PATH);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            this.db = new DatabaseSync(DB_FILE_PATH);
            console.log('[LabDatabase] SQLite connected at:', DB_FILE_PATH);

            // Execute schema
            if (fs.existsSync(SCHEMA_FILE_PATH)) {
                const schemaSql = fs.readFileSync(SCHEMA_FILE_PATH, 'utf-8');
                this.db.exec(schemaSql);
                console.log('[LabDatabase] Relational schema initialized successfully.');
            }
        } catch (err) {
            console.error('[LabDatabase] Initialization failed:', err);
            throw err;
        }
    }

    query(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.all(...params);
        } catch (err) {
            console.error('[LabDatabase] Query error:', sql, err.message);
            throw err;
        }
    }

    get(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.get(...params);
        } catch (err) {
            console.error('[LabDatabase] Get error:', sql, err.message);
            throw err;
        }
    }

    run(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.run(...params);
        } catch (err) {
            console.error('[LabDatabase] Run error:', sql, err.message);
            throw err;
        }
    }

    exec(sql) {
        return this.db.exec(sql);
    }
}

export const labDb = new LabDatabase();
