-- ===========================
-- 1. Drop Existing Tables (Order Matters)
-- ===========================
DROP TABLE IF EXISTS "Inventory";
DROP TABLE IF EXISTS "Cases";
DROP TABLE IF EXISTS "Skins";
DROP TABLE IF EXISTS "UserInfo";

-- ===========================
-- 2. UserInfo Table
-- ===========================
CREATE TABLE IF NOT EXISTS "UserInfo" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    wallet_address TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- 3. Skins Table
-- ===========================
CREATE TABLE IF NOT EXISTS "Skins" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (LOWER(type) IN ('board', 'pieceset1', 'pieceset2')) NOT NULL,  -- Ensure lowercase for type
    metadata_url TEXT NOT NULL UNIQUE,
    collection_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- 4. Inventory Table
-- ===========================
CREATE TABLE IF NOT EXISTS "Inventory" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES "UserInfo"(id) ON DELETE CASCADE,
    skin_id UUID REFERENCES "Skins"(id) ON DELETE SET NULL,
    is_equipped BOOLEAN DEFAULT FALSE,
    equipped_type TEXT CHECK (equipped_type IN ('board', 'piece')),
    is_case BOOLEAN DEFAULT FALSE,
    obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source TEXT,

    CHECK ((is_equipped AND equipped_type IS NOT NULL) OR (NOT is_equipped)),  -- Fallback constraint for equipment logic
    CHECK ((is_case AND skin_id IS NULL) OR (NOT is_case AND skin_id IS NOT NULL))  -- Fallback constraint for case logic
);

-- ===========================
-- 5. Cases Table
-- ===========================
CREATE TABLE IF NOT EXISTS "Cases" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    skin_pool JSONB NOT NULL,  -- Example: ["uuid1", "uuid2", "uuid3"]
    rarity_weights JSONB  -- Example: {"common": 60, "rare": 30, "epic": 10}
);
