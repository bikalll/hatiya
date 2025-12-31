-- Add new columns for enhanced product details
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS dimensions TEXT;

-- Recommended: Add an index on SKU if it will be used for lookups
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
