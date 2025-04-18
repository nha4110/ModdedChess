-- 1. UserInfo Table
CREATE TABLE "UserInfo" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    wallet_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "UserInfo" ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- 2. Skins Table
CREATE TABLE "Skins" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('board', 'piece')) NOT NULL,
    image_url TEXT NOT NULL,
    metadata_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inventory Table
CREATE TABLE "Inventory" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES "UserInfo"(id) ON DELETE CASCADE,
    skin_id UUID REFERENCES "Skins"(id) ON DELETE SET NULL,
    is_equipped BOOLEAN DEFAULT FALSE,
    equipped_type TEXT CHECK (equipped_type IN ('board', 'piece')),

    is_case BOOLEAN DEFAULT FALSE,
    obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source TEXT
);

-- 4. Cases Table
CREATE TABLE "Cases" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image_url TEXT,
    skin_pool JSONB NOT NULL,         -- array of skin IDs
    rarity_weights JSONB              -- map of rarity to weight
);
