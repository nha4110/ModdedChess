-- ===========================
-- 1. Drop All Existing Tables (Order Matters)
-- ===========================
DROP TABLE IF EXISTS "Inventory";
DROP TABLE IF EXISTS "Cases"; -- deprecated
DROP TABLE IF EXISTS "Skins";
DROP TABLE IF EXISTS "UserInfo";

-- ===========================
-- 2. Recreate UserInfo Table
-- ===========================
CREATE TABLE IF NOT EXISTS "UserInfo" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    wallet_address TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    chests_received INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- 3. Recreate Skins Table
-- ===========================
CREATE TABLE IF NOT EXISTS "Skins" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (LOWER(type) IN ('board', 'pieceset1', 'pieceset2')) NOT NULL,
    metadata_url TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    collection_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- 4. Recreate Inventory Table
-- ===========================
CREATE TABLE IF NOT EXISTS "Inventory" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES "UserInfo"(id) ON DELETE CASCADE,
    skin_id UUID REFERENCES "Skins"(id) ON DELETE SET NULL,
    is_equipped BOOLEAN DEFAULT FALSE,
    equipped_type TEXT CHECK (equipped_type IN ('board', 'piece')),
    obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source TEXT,

    CHECK ((is_equipped AND equipped_type IS NOT NULL) OR (NOT is_equipped))
);


