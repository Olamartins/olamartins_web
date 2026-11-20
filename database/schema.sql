-- ============================================================================
-- Ola Martins portfolio / CMS — PostgreSQL schema
-- Run once via phpPgAdmin (cPanel) or automatically on first server start.
-- ============================================================================

CREATE TABLE IF NOT EXISTS admins (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120)  NOT NULL,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Single-row table holding the editable site content (hero, contact, ...)
CREATE TABLE IF NOT EXISTS site_settings (
    id         INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data       JSONB    NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    excerpt     TEXT,
    content     TEXT         NOT NULL,
    cover_image TEXT,
    published   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Free learning materials (ebooks, videos, guides) for visitors
CREATE TABLE IF NOT EXISTS resources (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    type        VARCHAR(20)  NOT NULL CHECK (type IN ('ebook', 'video', 'article', 'course', 'guide')),
    format      VARCHAR(20),               -- e.g. pdf, mp4, link
    file_url    TEXT,                      -- where visitors download / watch
    thumbnail   TEXT,
    tags        TEXT[]       DEFAULT '{}',
    published   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Paid digital products, sold through Selar (selar.co)
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category    VARCHAR(30)  NOT NULL CHECK (category IN ('power-bi', 'excel', 'tableau', 'ebook', 'other')),
    price       NUMERIC(10,2) NOT NULL DEFAULT 0,
    currency    VARCHAR(3)   NOT NULL DEFAULT 'USD',
    selar_url   TEXT         NOT NULL,      -- Selar checkout link
    thumbnail   TEXT,
    features    JSONB        DEFAULT '[]'::jsonb,
    is_featured BOOLEAN      NOT NULL DEFAULT FALSE,
    published   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- "Get a Free Consultation" form submissions
CREATE TABLE IF NOT EXISTS consultation_requests (
    id         SERIAL PRIMARY KEY,
    first_name VARCHAR(120) NOT NULL,
    last_name  VARCHAR(120),
    email      VARCHAR(255) NOT NULL,
    code       VARCHAR(10),               -- country calling code
    zip_code   VARCHAR(30),               -- national number (legacy field, kept for old rows)
    phone      VARCHAR(30),               -- full international number, e.g. +2348012345678
    message    TEXT         NOT NULL,
    status     VARCHAR(20)  NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_published      ON posts (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_published  ON resources (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_type       ON resources (type);
CREATE INDEX IF NOT EXISTS idx_products_published   ON products (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category    ON products (category);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultation_requests (status, created_at DESC);

-- Keep updated_at current on every update
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_posts_updated      ON posts;
DROP TRIGGER IF EXISTS trg_resources_updated  ON resources;
DROP TRIGGER IF EXISTS trg_products_updated   ON products;

CREATE TRIGGER trg_posts_updated     BEFORE UPDATE ON posts     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_resources_updated BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_updated  BEFORE UPDATE ON products  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
