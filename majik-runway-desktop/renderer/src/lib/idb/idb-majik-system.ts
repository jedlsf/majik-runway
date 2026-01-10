// lib/indexedDB.ts
import { openDB, type IDBPDatabase } from 'idb';

export interface ZWorldIDBSaveData {
    id: string;
    data: Blob;
    savedAt: number;
}

interface ZWorldAutosaveSchema {
    majikdata: ZWorldIDBSaveData;
}

let dbPromise: Promise<IDBPDatabase<ZWorldAutosaveSchema>>;


export function initDB() {
    if (!dbPromise) {
        dbPromise = openDB('MajikAutosaveDB', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('majikdata')) {
                    db.createObjectStore('majikdata', { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
}

export async function idbSaveBlob(id: string, data: Blob) {
    const db = await initDB();
    await db.put('majikdata', { id, data, savedAt: Date.now() });
}

export async function idbLoadBlob(id: string): Promise<ZWorldIDBSaveData | undefined> {
    try {
        const db = await initDB();
        return await db.get('majikdata', id);
    } catch (err) {
        console.error(`Failed to load blob with id "${id}":`, err);
        return undefined;
    }
}

export async function deleteBlob(id: string) {
    const db = await initDB();
    return db.delete('majikdata', id);
}

export async function clearAllBlobs() {
    const db = await initDB();
    return db.clear('majikdata');
}
