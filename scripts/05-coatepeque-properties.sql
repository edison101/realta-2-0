-- Propiedades específicas en Coatepeque, Quetzaltenango
-- Primero agregar más propietarios para las nuevas propiedades
INSERT INTO users (id, email, first_name, last_name, phone, preferred_currency, preferred_locale, timezone, country_code, role) VALUES
-- Propietarios adicionales para Coatepeque
('550e8400-e29b-41d4-a716-446655440020', 'roberto.mendez@gmail.com', 'Roberto', 'Méndez', '+502-7765-4321', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'OWNER'),
('550e8400-e29b-41d4-a716-446655440021', 'patricia.santos@gmail.com', 'Patricia', 'Santos', '+502-7766-5432', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'OWNER'),
('550e8400-e29b-41d4-a716-446655440022', 'fernando.castillo@gmail.com', 'Fernando', 'Castillo', '+502-7767-6543', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'OWNER'),
('550e8400-e29b-41d4-a716-446655440023', 'claudia.morales@gmail.com', 'Claudia', 'Morales', '+502-7768-7654', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'OWNER'),

-- Inquilinos adicionales
('550e8400-e29b-41d4-a716-446655440024', 'diego.ramirez@gmail.com', 'Diego', 'Ramírez', '+502-7769-8765', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'TENANT'),
('550e8400-e29b-41d4-a716-446655440025', 'valeria.cruz@gmail.com', 'Valeria', 'Cruz', '+502-7770-9876', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'TENANT'),
('550e8400-e29b-41d4-a716-446655440026', 'mario.lopez@gmail.com', 'Mario', 'López', '+502-7771-0987', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'TENANT'),
('550e8400-e29b-41d4-a716-446655440027', 'andrea.garcia@gmail.com', 'Andrea', 'García', '+502-7772-1098', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'TENANT'),
('550e8400-e29b-41d4-a716-446655440028', 'carlos.jimenez@gmail.com', 'Carlos', 'Jiménez', '+502-7773-2109', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'TENANT'),
('550e8400-e29b-41d4-a716-446655440029', 'lucia.torres@gmail.com', 'Lucía', 'Torres', '+502-7774-3210', 'GTQ', 'es-GT', 'America/Guatemala', 'GT', 'TENANT');

-- CASAS EN CONDOMINIOS DE COATEPEQUE

-- Casa G8 - Condominio Las Ramblas (Estilo Español Colonial)
INSERT INTO properties (id, owner_id, title, description, address, city, state, country, postal_code, latitude, longitude, price_amount, price_currency, property_type, bedrooms, bathrooms, area_sqm, amenities, images, status, is_featured) VALUES
('650e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440020',
'Casa G8 - Condominio Las Ramblas',
'Elegante casa estilo español colonial en el exclusivo Condominio Las Ramblas, Coatepeque. 3 habitaciones, arquitectura tradicional con toques modernos. Garita de seguridad 24/7, cerca de hospitales, universidades y centros comerciales.',
'Casa G8, Condominio Las Ramblas', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7019, -91.8628,
450000, 'GTQ', 'HOUSE', 3, 2, 140.0,
'["Garita de seguridad 24/7", "Estilo español colonial", "Jardín privado", "Garaje techado", "Patio central", "Cerca de hospitales", "Cerca de universidades", "Centros comerciales cercanos"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', true),

-- Casa - Condominio Montebello (Estilo Minimalista Moderno)
('650e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440021',
'Casa Moderna - Condominio Montebello',
'Hermosa casa de diseño minimalista moderno en Condominio Montebello, Coatepeque. Líneas limpias, espacios abiertos, acabados contemporáneos. Seguridad 24/7 en sector exclusivo.',
'Condominio Montebello, Coatepeque', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7025, -91.8635,
400000, 'GTQ', 'HOUSE', 3, 2, 130.0,
'["Garita de seguridad 24/7", "Diseño minimalista", "Espacios abiertos", "Cocina moderna", "Terraza", "Sector exclusivo", "Cerca de servicios médicos", "Acceso a universidades"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', true),

-- Casa - Condominio El Bosque
('650e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440022',
'Casa Familiar - Condominio El Bosque',
'Acogedora casa familiar en Condominio El Bosque, Coatepeque. Ambiente tranquilo rodeado de naturaleza, ideal para familias. Seguridad privada y ubicación estratégica.',
'Condominio El Bosque, Coatepeque', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7030, -91.8640,
400000, 'GTQ', 'HOUSE', 3, 2, 125.0,
'["Garita de seguridad", "Ambiente natural", "Área verde privada", "Garaje", "Sala familiar", "Cerca de colegios", "Acceso a centros comerciales", "Zona hospitalaria cercana"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- APARTAMENTOS CONDOMINIO ALAMEDA

-- Apartamento 1 - Condominio Alameda
('650e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440020',
'Apartamento 1 - Condominio Alameda',
'Moderno apartamento de 2 habitaciones en Condominio Alameda, Coatepeque. Edificio con seguridad 24/7, ubicado en sector exclusivo con fácil acceso a servicios médicos y educativos.',
'Apartamento 1, Condominio Alameda', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7015, -91.8620,
200000, 'GTQ', 'APARTMENT', 2, 1, 65.0,
'["Garita de seguridad 24/7", "Edificio moderno", "Balcón", "Cocina equipada", "Área de lavandería", "Sector exclusivo", "Cerca de hospitales", "Universidades cercanas"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- Apartamento 2 - Condominio Alameda
('650e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440021',
'Apartamento 2 - Condominio Alameda',
'Cómodo apartamento de 2 habitaciones en Condominio Alameda, Coatepeque. Excelente iluminación natural, acabados de calidad, en complejo residencial exclusivo.',
'Apartamento 2, Condominio Alameda', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7015, -91.8620,
200000, 'GTQ', 'APARTMENT', 2, 1, 68.0,
'["Seguridad privada", "Iluminación natural", "Acabados de calidad", "Área social", "Parqueo asignado", "Centros comerciales cercanos", "Acceso a servicios médicos", "Zona universitaria"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- APARTAMENTOS G* - CONDOMINIO LAS RAMBLAS

-- Apartamento G*1 - Las Ramblas
('650e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440022',
'Apartamento G*1 - Condominio Las Ramblas',
'Apartamento ejecutivo en torre residencial del prestigioso Condominio Las Ramblas. Diseño contemporáneo, ubicación privilegiada en Coatepeque.',
'Apartamento G*1, Torre Residencial Las Ramblas', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7019, -91.8628,
200000, 'GTQ', 'APARTMENT', 2, 1, 60.0,
'["Garita de seguridad 24/7", "Torre residencial", "Diseño contemporáneo", "Elevador", "Área social", "Gimnasio", "Cerca de hospitales", "Universidades cercanas"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- Apartamento G*2 - Las Ramblas
('650e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440023',
'Apartamento G*2 - Condominio Las Ramblas',
'Elegante apartamento en torre del Condominio Las Ramblas. Acabados premium, vista panorámica, en el corazón del sector más exclusivo de Coatepeque.',
'Apartamento G*2, Torre Residencial Las Ramblas', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7019, -91.8628,
200000, 'GTQ', 'APARTMENT', 2, 1, 62.0,
'["Seguridad 24/7", "Acabados premium", "Vista panorámica", "Área de recreación", "Salón de eventos", "Sector exclusivo", "Servicios médicos cercanos", "Centros educativos"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- APARTAMENTOS G15 - CONDOMINIO LAS RAMBLAS (4 apartamentos)

-- Apartamento G15-A
('650e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440020',
'Apartamento G15-A - Condominio Las Ramblas',
'Apartamento compacto y funcional en edificio G15 del Condominio Las Ramblas. Ideal para jóvenes profesionales o estudiantes universitarios. Máxima seguridad y comodidad.',
'Apartamento G15-A, Edificio G15 Las Ramblas', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7019, -91.8628,
200000, 'GTQ', 'APARTMENT', 1, 1, 45.0,
'["Garita de seguridad", "Edificio G15", "Funcional", "Ideal estudiantes", "Cerca universidades", "Transporte público", "Centros comerciales", "Servicios médicos"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- Apartamento G15-B
('650e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440021',
'Apartamento G15-B - Condominio Las Ramblas',
'Cómodo apartamento en edificio G15, Condominio Las Ramblas. Distribución inteligente, excelente ubicación para profesionales que buscan comodidad y seguridad.',
'Apartamento G15-B, Edificio G15 Las Ramblas', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7019, -91.8628,
200000, 'GTQ', 'APARTMENT', 1, 1, 47.0,
'["Seguridad privada", "Distribución inteligente", "Para profesionales", "Área de estudio", "Cocina moderna", "Hospitales cercanos", "Zona universitaria", "Shopping centers"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- Apartamento G15-C
('650e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440022',
'Apartamento G15-C - Condominio Las Ramblas',
'Apartamento moderno en edificio G15 del exclusivo Condominio Las Ramblas. Perfecto para parejas jóvenes, con todas las comodidades en sector premium de Coatepeque.',
'Apartamento G15-C, Edificio G15 Las Ramblas', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7019, -91.8628,
200000, 'GTQ', 'APARTMENT', 1, 1, 48.0,
'["Condominio exclusivo", "Para parejas", "Sector premium", "Todas las comodidades", "Área social", "Gimnasio", "Cerca de todo", "Máxima seguridad"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false),

-- Apartamento G15-D
('650e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440023',
'Apartamento G15-D - Condominio Las Ramblas',
'Último apartamento disponible en edificio G15, Condominio Las Ramblas. Excelente oportunidad en la zona más cotizada de Coatepeque, con acceso inmediato a servicios.',
'Apartamento G15-D, Edificio G15 Las Ramblas', 'Coatepeque', 'Quetzaltenango', 'GT', '09020', 14.7019, -91.8628,
200000, 'GTQ', 'APARTMENT', 1, 1, 46.0,
'["Última oportunidad", "Zona cotizada", "Acceso inmediato servicios", "Edificio G15", "Seguridad total", "Universidades", "Hospitales", "Centros comerciales"]',
'["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]',
'ACTIVE', false);

-- Contratos para algunas de las propiedades
INSERT INTO contracts (id, property_id, tenant_id, owner_id, monthly_rent_amount, monthly_rent_currency, deposit_amount, deposit_currency, start_date, end_date, status, terms_template) VALUES
-- Casa G8 Las Ramblas
('750e8400-e29b-41d4-a716-446655440020', '650e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440020',
45000000, 'GTQ', 90000000, 'GTQ', '2024-01-01', '2024-12-31', 'ACTIVE', 'GT_STANDARD'),

-- Apartamento 1 Alameda
('750e8400-e29b-41d4-a716-446655440021', '650e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440020',
20000000, 'GTQ', 40000000, 'GTQ', '2024-02-01', '2025-01-31', 'ACTIVE', 'GT_STANDARD'),

-- Apartamento G*1 Las Ramblas
('750e8400-e29b-41d4-a716-446655440022', '650e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440022',
20000000, 'GTQ', 40000000, 'GTQ', '2024-01-15', '2025-01-14', 'ACTIVE', 'GT_STANDARD');

-- Transacciones de ejemplo
INSERT INTO transactions (id, contract_id, payer_id, recipient_id, amount, currency, transaction_type, status, created_at) VALUES
('850e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440020',
45000000, 'GTQ', 'RENT_PAYMENT', 'COMPLETED', '2024-01-01 10:00:00+00'),

('850e8400-e29b-41d4-a716-446655440021', '750e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440020',
20000000, 'GTQ', 'RENT_PAYMENT', 'COMPLETED', '2024-02-01 10:00:00+00'),

('850e8400-e29b-41d4-a716-446655440022', '750e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440022',
20000000, 'GTQ', 'RENT_PAYMENT', 'COMPLETED', '2024-01-15 10:00:00+00');
