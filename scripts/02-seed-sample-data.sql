-- Insertar usuarios de ejemplo para diferentes países de Latinoamérica
INSERT INTO users (id, email, first_name, last_name, phone, preferred_currency, preferred_locale, timezone, country_code, role) VALUES
-- Propietarios
('550e8400-e29b-41d4-a716-446655440001', 'carlos.rodriguez@email.com', 'Carlos', 'Rodríguez', '+52-555-123-4567', 'MXN', 'es-MX', 'America/Mexico_City', 'MX', 'OWNER'),
('550e8400-e29b-41d4-a716-446655440002', 'maria.silva@email.com', 'María', 'Silva', '+55-11-98765-4321', 'BRL', 'pt-BR', 'America/Sao_Paulo', 'BR', 'OWNER'),
('550e8400-e29b-41d4-a716-446655440003', 'juan.perez@email.com', 'Juan', 'Pérez', '+54-11-2345-6789', 'ARS', 'es-AR', 'America/Argentina/Buenos_Aires', 'AR', 'OWNER'),
('550e8400-e29b-41d4-a716-446655440004', 'ana.garcia@email.com', 'Ana', 'García', '+57-1-234-5678', 'COP', 'es-CO', 'America/Bogota', 'CO', 'OWNER'),
('550e8400-e29b-41d4-a716-446655440005', 'luis.martinez@email.com', 'Luis', 'Martínez', '+56-2-3456-7890', 'CLP', 'es-CL', 'America/Santiago', 'CL', 'OWNER'),

-- Inquilinos
('550e8400-e29b-41d4-a716-446655440006', 'sofia.lopez@email.com', 'Sofía', 'López', '+51-1-345-6789', 'PEN', 'es-PE', 'America/Lima', 'PE', 'TENANT'),
('550e8400-e29b-41d4-a716-446655440007', 'diego.morales@email.com', 'Diego', 'Morales', '+598-2-456-7890', 'UYU', 'es-UY', 'America/Montevideo', 'UY', 'TENANT'),
('550e8400-e29b-41d4-a716-446655440008', 'camila.torres@email.com', 'Camila', 'Torres', '+591-2-567-8901', 'BOB', 'es-BO', 'America/La_Paz', 'BO', 'TENANT'),

-- Administrador
('550e8400-e29b-41d4-a716-446655440009', 'admin@realta.com', 'Admin', 'Realta', '+1-555-000-0000', 'USD', 'es-MX', 'America/Mexico_City', 'MX', 'ADMIN');

-- Insertar propiedades de ejemplo en diferentes países
INSERT INTO properties (id, owner_id, title, description, address, city, state, country, postal_code, latitude, longitude, price_amount, price_currency, property_type, bedrooms, bathrooms, area_sqm, amenities, images, status, is_featured) VALUES

-- México
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 
'Departamento Moderno en Polanco', 
'Hermoso departamento de 2 recámaras en una de las mejores zonas de la Ciudad de México. Cuenta con acabados de lujo, cocina integral y vista panorámica.',
'Av. Presidente Masaryk 123', 'Ciudad de México', 'CDMX', 'MX', '11560', 19.4326, -99.1332,
2500000, 'MXN', 'APARTMENT', 2, 2, 85.5,
'["Gimnasio", "Alberca", "Seguridad 24/7", "Estacionamiento", "Terraza"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', true),

-- Brasil
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002',
'Apartamento em Copacabana',
'Lindo apartamento de 3 quartos com vista para o mar em Copacabana. Localização privilegiada a poucos metros da praia.',
'Av. Atlântica 456', 'Rio de Janeiro', 'RJ', 'BR', '22070-000', -22.9068, -43.1729,
450000, 'BRL', 'APARTMENT', 3, 2, 95.0,
'["Vista para o mar", "Portaria 24h", "Próximo à praia", "Ar condicionado"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', true),

-- Argentina
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003',
'Loft en Palermo Soho',
'Moderno loft de 1 ambiente en el corazón de Palermo Soho. Ideal para jóvenes profesionales. Totalmente amueblado.',
'Gurruchaga 789', 'Buenos Aires', 'CABA', 'AR', 'C1414', -34.6037, -58.3816,
18000000, 'ARS', 'STUDIO', 1, 1, 45.0,
'["Amueblado", "WiFi", "Cocina equipada", "Cerca del metro"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- Colombia
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004',
'Casa en Zona Rosa',
'Hermosa casa de 4 habitaciones en la exclusiva Zona Rosa de Bogotá. Perfecta para familias.',
'Carrera 13 #85-32', 'Bogotá', 'Cundinamarca', 'CO', '110221', 4.7110, -74.0721,
820000000, 'COP', 'HOUSE', 4, 3, 180.0,
'["Jardín privado", "Garaje para 2 carros", "Chimenea", "Estudio"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', true),

-- Chile
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005',
'Departamento en Las Condes',
'Elegante departamento de 2 dormitorios en Las Condes con vista a la cordillera. Edificio con amenities completos.',
'Av. Apoquindo 1234', 'Santiago', 'Región Metropolitana', 'CL', '7550000', -33.4489, -70.6693,
68000000, 'CLP', 'APARTMENT', 2, 2, 75.0,
'["Vista a la cordillera", "Gimnasio", "Piscina", "Concierge"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- Perú
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001',
'Departamento en Miraflores',
'Acogedor departamento de 2 habitaciones en Miraflores, cerca del malecón y centros comerciales.',
'Av. Larco 567', 'Lima', 'Lima', 'PE', '15074', -12.0464, -77.0428,
280000, 'PEN', 'APARTMENT', 2, 1, 65.0,
'["Cerca al malecón", "Supermercados cercanos", "Transporte público"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false);

-- Insertar algunos contratos de ejemplo
INSERT INTO contracts (id, property_id, tenant_id, owner_id, monthly_rent_amount, monthly_rent_currency, deposit_amount, deposit_currency, start_date, end_date, status, terms_template) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003',
18000000, 'ARS', 36000000, 'ARS', '2024-01-01', '2024-12-31', 'ACTIVE', 'AR_STANDARD'),

('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001',
280000, 'PEN', 560000, 'PEN', '2024-02-01', '2025-01-31', 'ACTIVE', 'PE_STANDARD');

-- Insertar algunas transacciones de ejemplo
INSERT INTO transactions (id, contract_id, payer_id, recipient_id, amount, currency, transaction_type, status, created_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003',
18000000, 'ARS', 'RENT_PAYMENT', 'COMPLETED', '2024-01-01 10:00:00+00'),

('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001',
280000, 'PEN', 'RENT_PAYMENT', 'COMPLETED', '2024-02-01 10:00:00+00');
