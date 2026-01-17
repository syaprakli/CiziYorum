import localforage from 'localforage';

// Configure the IndexedDB instance
export const db = localforage.createInstance({
    name: 'AsafDrawDB',
    storeName: 'user_data',
    description: 'Storage for drawings, profile, and settings'
});

// Keys used in storage
const KEYS = {
    GALLERY: 'galleryDrawings',
    PROFILE_IMAGE: 'userProfileImage',
    PROFILE_DATA: 'userProfileData',
    LEVEL: 'userLevel',
    MIGRATION_DONE: 'migration_v1_complete'
};

/**
 * Migrates data from localStorage to IndexedDB if not already done.
 */
export const migrateFromLocalStorage = async () => {
    try {
        const isMigrated = await db.getItem(KEYS.MIGRATION_DONE);
        if (isMigrated) return;

        console.log('Starting migration from localStorage to IndexedDB...');

        // 1. Migrate Gallery
        const localGallery = localStorage.getItem(KEYS.GALLERY);
        if (localGallery) {
            const parsed = JSON.parse(localGallery);
            if (Array.isArray(parsed) && parsed.length > 0) {
                await db.setItem(KEYS.GALLERY, parsed);
                console.log(`Migrated ${parsed.length} drawings.`);
            }
        }

        // 2. Migrate Profile Image
        const localImage = localStorage.getItem(KEYS.PROFILE_IMAGE);
        if (localImage) {
            await db.setItem(KEYS.PROFILE_IMAGE, localImage);
            console.log('Migrated profile image.');
        }

        // 2.1 Migrate Profile Data
        const localData = localStorage.getItem(KEYS.PROFILE_DATA);
        if (localData) {
            await db.setItem(KEYS.PROFILE_DATA, JSON.parse(localData));
            console.log('Migrated profile data.');
        }

        // 3. Migrate Level
        const localLevel = localStorage.getItem(KEYS.LEVEL);
        if (localLevel) {
            await db.setItem(KEYS.LEVEL, localLevel);
            console.log('Migrated user level.');
        }

        // Mark as done
        await db.setItem(KEYS.MIGRATION_DONE, true);
        console.log('Migration completed successfully.');

        // Optional: Clear localStorage to free up space, 
        // but keeping it for now as a backup/fallback isn't a bad idea 
        // until we are 100% sure.
        // localStorage.removeItem(KEYS.GALLERY); 
    } catch (error) {
        console.error('Migration failed:', error);
    }
};

// --- Helper Functions ---

export const getGallery = async () => {
    return (await db.getItem(KEYS.GALLERY)) || [];
};

export const saveDrawingToGallery = async (drawing) => {
    const currentGeneric = await getGallery();
    // Ensure it's an array
    const current = Array.isArray(currentGeneric) ? currentGeneric : [];

    const updated = [drawing, ...current];
    await db.setItem(KEYS.GALLERY, updated);
    return updated;
};

export const saveGallery = async (gallery) => {
    return await db.setItem(KEYS.GALLERY, gallery);
};

export const deleteDrawingFromGallery = async (idOfDrawing) => {
    const current = await getGallery();
    const updated = current.filter(d => d.id !== idOfDrawing);
    await db.setItem(KEYS.GALLERY, updated);
    return updated; // Return updated state
};

export const getProfileImage = async () => {
    return await db.getItem(KEYS.PROFILE_IMAGE);
};

export const saveProfileImage = async (base64Image) => {
    return await db.setItem(KEYS.PROFILE_IMAGE, base64Image);
};

export const getProfileData = async () => {
    return await db.getItem(KEYS.PROFILE_DATA);
};

export const saveProfileData = async (data) => {
    return await db.setItem(KEYS.PROFILE_DATA, data);
};

export const getUserLevel = async () => {
    const level = await db.getItem(KEYS.LEVEL);
    return level ? parseInt(level) : 1;
};

export const saveUserLevel = async (level) => {
    return await db.setItem(KEYS.LEVEL, level.toString());
};
