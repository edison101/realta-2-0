-- Datos específicos para Guatemala
-- Insertar usuarios guatemaltecos
INSERT INTO users (id, email, first_name, last_name, phone, preferred_currency, preferred_locale, timezone, country_code, role) VALUES
-- Propietarios guatemaltecos
('550e8400-e29b-41d4-a716-446655440010', 'carlos.morales@gmail.com', 'Carlos', 'Morales', '+502-2345-6789', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'OWNER'),
('550e8400-e29b-41d4-a716-446655440011', 'maria.lopez@gmail.com', 'María', 'López', '+502-3456-7890', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'OWNER'),
('550e8400-e29b-41d4-a716-446655440012', 'jose.garcia@gmail.com', 'José', 'García', '+502-4567-8901', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'OWNER'),

-- Inquilinos guatemaltecos
('550e8400-e29b-41d4-a716-446655440013', 'ana.rodriguez@gmail.com', 'Ana', 'Rodríguez', '+502-5678-9012', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'TENANT'),
('550e8400-e29b-41d4-a716-446655440014', 'luis.martinez@gmail.com', 'Luis', 'Martínez', '+502-6789-0123', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'TENANT'),
('550e8400-e29b-41d4-a716-446655440015', 'sofia.hernandez@gmail.com', 'Sofía', 'Hernández', '+502-7890-1234', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'TENANT');

-- Propiedades en Guatemala (precios en Quetzales)
INSERT INTO properties (id, owner_id, title, description, address, city, state, country, postal_code, latitude, longitude, price_amount, price_currency, property_type, bedrooms, bathrooms, area_sqm, amenities, images, status, is_featured) VALUES

-- Ciudad de Guatemala - Zona 10
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010',
'Apartamento Moderno en Zona 10',
'Hermoso apartamento de 2 habitaciones en la exclusiva Zona 10 de Guatemala. Edificio con seguridad 24/7, gimnasio y área social. Cerca de centros comerciales y restaurantes.',
'4a Avenida 15-20, Zona 10', 'Ciudad de Guatemala', 'Guatemala', 'GT', '01010', 14.5995, -90.5069,
850000, 'GTQ', 'APARTMENT', 2, 2, 85.0,
'["Seguridad 24/7", "Gimnasio", "Piscina", "Parqueo", "Área social", "Balcón"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', true),

-- Antigua Guatemala
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011',
'Casa Colonial en Antigua Guatemala',
'Encantadora casa colonial restaurada en el corazón de Antigua Guatemala. 3 habitaciones, patio central, vista al volcán. Perfecta para familias o profesionales.',
'5a Calle Poniente #25', 'Antigua Guatemala', 'Sacatepéquez', 'GT', '03001', 14.5586, -90.7344,
1200000, 'GTQ', 'HOUSE', 3, 2, 150.0,
'["Patio central", "Vista al volcán", "Arquitectura colonial", "Jardín", "Chimenea", "Terraza"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', true),

-- Zona 14 - Guatemala City
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012',
'Departamento Ejecutivo Zona 14',
'Moderno departamento de 1 habitación en Zona 14. Ideal para ejecutivos. Completamente amueblado, internet de alta velocidad, cerca de oficinas corporativas.',
'Boulevard Los Próceres 24-69, Zona 14', 'Ciudad de Guatemala', 'Guatemala', 'GT', '01014', 14.5731, -90.4936,
650000, 'GTQ', 'APARTMENT', 1, 1, 55.0,
'["Amueblado", "Internet fibra óptica", "Aire acondicionado", "Cocina equipada", "Lavandería"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- Quetzaltenango (Xela)
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440010',
'Casa Familiar en Quetzaltenango',
'Amplia casa de 4 habitaciones en Quetzaltenango. Zona residencial tranquila, cerca de escuelas y universidades. Ideal para familias grandes.',
'12 Avenida 8-45, Zona 3', 'Quetzaltenango', 'Quetzaltenango', 'GT', '09001', 14.8333, -91.5167,
750000, 'GTQ', 'HOUSE', 4, 3, 180.0,
'["Garaje para 2 carros", "Jardín amplio", "Área de lavado", "Sala familiar", "Comedor formal"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- Zona 15 - Guatemala City
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440011',
'Estudio Moderno Zona 15',
'Acogedor estudio en Zona 15, perfecto para estudiantes o jóvenes profesionales. Edificio nuevo con todas las comodidades modernas.',
'7a Avenida 3-77, Zona 15', 'Ciudad de Guatemala', 'Guatemala', 'GT', '01015', 14.6211, -90.5069,
450000, 'GTQ', 'STUDIO', 1, 1, 35.0,
'["Edificio nuevo", "Seguridad", "Elevador", "Área común", "Cerca del transporte"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- Mixco
('650e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440012',
'Casa en Condominio - Mixco',
'Casa de 3 habitaciones en condominio privado en Mixco. Seguridad 24/7, áreas verdes, cerca de centros comerciales. Excelente para familias.',
'Condominio Los Alamos, Casa 15', 'Mixco', 'Guatemala', 'GT', '01057', 14.6308, -90.6067,
950000, 'GTQ', 'HOUSE', 3, 2, 120.0,
'["Condominio privado", "Seguridad 24/7", "Áreas verdes", "Parque infantil", "Salón comunal"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', true);

-- Contratos activos en Guatemala
INSERT INTO contracts (id, property_id, tenant_id, owner_id, monthly_rent_amount, monthly_rent_currency, deposit_amount, deposit_currency, start_date, end_date, status, terms_template) VALUES
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440012',
65000000, 'GTQ', 130000000, 'GTQ', '2024-01-15', '2025-01-14', 'ACTIVE', 'GT_STANDARD'),

('750e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440011',
45000000, 'GTQ', 90000000, 'GTQ', '2024-02-01', '2025-01-31', 'ACTIVE', 'GT_STANDARD');

-- Transacciones de ejemplo en Guatemala
INSERT INTO transactions (id, contract_id, payer_id, recipient_id, amount, currency, transaction_type, status, created_at) VALUES
('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440012',
65000000, 'GTQ', 'RENT_PAYMENT', 'COMPLETED', '2024-01-15 10:00:00+00'),

('850e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440011',
45000000, 'GTQ', 'RENT_PAYMENT', 'COMPLETED', '2024-02-01 10:00:00+00'),

('850e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440012',
65000000, 'GTQ', 'RENT_PAYMENT', 'COMPLETED', '2024-02-15 10:00:00+00');
