-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_name TEXT,
    customer_phone TEXT, -- Optional, if we want to capture it before whatsapp
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name TEXT, -- Snapshot in case product is deleted
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies (Public can insert, Admin can view all)
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all orders" ON orders FOR SELECT USING (true); -- Assuming simple auth for now or anonymous read limitation
CREATE POLICY "Admin can view all order items" ON order_items FOR SELECT USING (true);

-- Allow admins to update status
CREATE POLICY "Admin can update orders" ON orders FOR UPDATE USING (true);
