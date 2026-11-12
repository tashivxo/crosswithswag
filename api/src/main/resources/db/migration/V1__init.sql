-- SWAG v1 order schema (backend-plan §5.2). JPA entities added by TDD agent.

CREATE TABLE orders (
    id UUID PRIMARY KEY,
    ref VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    ship_method VARCHAR(32) NOT NULL,
    paxi_code VARCHAR(64),
    paxi_name VARCHAR(255),
    paxi_address TEXT,
    address_text TEXT,
    subtotal_cents INTEGER NOT NULL,
    shipping_cents INTEGER NOT NULL,
    total_cents INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'ZAR',
    payfast_payment_id VARCHAR(255),
    payfast_itn_payload TEXT,
    customer_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT orders_ref_unique UNIQUE (ref)
);

CREATE TABLE order_lines (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    sku VARCHAR(128) NOT NULL,
    size VARCHAR(16) NOT NULL,
    qty INTEGER NOT NULL,
    unit_price_cents INTEGER NOT NULL,
    product_name VARCHAR(255),
    colourway_name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_order_lines_order_id ON order_lines (order_id);
