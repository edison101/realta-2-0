-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de tasas de cambio para monedas latinoamericanas
CREATE TABLE currency_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    target_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(15,8) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(base_currency, target_currency)
);

-- Índices para optimizar consultas de conversión
CREATE INDEX idx_currency_rates_target ON currency_rates(target_currency);
CREATE INDEX idx_currency_rates_updated ON currency_rates(last_updated);

-- Insertar tasas iniciales para monedas latinoamericanas
INSERT INTO currency_rates (target_currency, rate) VALUES
('MXN', 17.25),  -- Peso Mexicano
('ARS', 350.50), -- Peso Argentino
('COP', 4100.00), -- Peso Colombiano
('CLP', 850.00),  -- Peso Chileno
('PEN', 3.75),    -- Sol Peruano
('BRL', 5.20),    -- Real Brasileño
('UYU', 39.50),   -- Peso Uruguayo
('BOB', 6.90),    -- Boliviano
('PYG', 7300.00), -- Guaraní Paraguayo
('CRC', 520.00),  -- Colón Costarricense
('GTQ', 7.80),    -- Quetzal Guatemalteco
('HNL', 24.70),   -- Lempira Hondureña
('NIO', 36.80),   -- Córdoba Nicaragüense
('PAB', 1.00),    -- Balboa Panameña
('DOP', 56.50),   -- Peso Dominicano
('EUR', 0.92),    -- Euro (para comparación)
('CAD', 1.35);    -- Dólar Canadiense

-- Tabla de usuarios con configuración regional
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    preferred_currency VARCHAR(3) DEFAULT 'USD',
    preferred_locale VARCHAR(10) DEFAULT 'es-MX',
    timezone VARCHAR(50) DEFAULT 'America/Mexico_City',
    country_code VARCHAR(2),
    role VARCHAR(20) DEFAULT 'TENANT' CHECK (role IN ('TENANT', 'OWNER', 'ADMIN')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de propiedades con precios en moneda nativa
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(2) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Precio en la unidad más pequeña (centavos) para evitar errores de punto flotante
    price_amount BIGINT NOT NULL,
    price_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('APARTMENT', 'HOUSE', 'CONDO', 'STUDIO', 'ROOM')),
    bedrooms INTEGER DEFAULT 0,
    bathrooms DECIMAL(3,1) DEFAULT 0,
    area_sqm DECIMAL(8,2),
    
    -- Características
    amenities JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    
    -- Estado de la propiedad
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'RENTED', 'MAINTENANCE', 'INACTIVE')),
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_location ON properties(country, city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price_amount, price_currency);
CREATE INDEX idx_properties_type ON properties(property_type);

-- Tabla de contratos con moneda específica
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Términos financieros en moneda específica
    monthly_rent_amount BIGINT NOT NULL,
    monthly_rent_currency VARCHAR(3) NOT NULL,
    deposit_amount BIGINT NOT NULL,
    deposit_currency VARCHAR(3) NOT NULL,
    
    -- Fechas del contrato (almacenadas en UTC)
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    
    -- Términos y condiciones localizados
    terms_template VARCHAR(50), -- Referencia a plantilla legal por país
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de transacciones con trazabilidad completa
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),
    
    -- Montos en moneda específica
    amount BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL,
    
    -- Información de conversión (si aplica)
    original_amount BIGINT,
    original_currency VARCHAR(3),
    exchange_rate DECIMAL(15,8),
    
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('RENT_PAYMENT', 'DEPOSIT', 'REFUND', 'COMMISSION')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    
    -- Integración con Stripe
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
