-- Agregar campos de privacidad y estado de alquiler
ALTER TABLE properties ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'DRAFT'));
ALTER TABLE properties ADD COLUMN IF NOT EXISTS rental_status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (rental_status IN ('AVAILABLE', 'RENTED', 'RESERVED', 'MAINTENANCE'));
ALTER TABLE properties ADD COLUMN IF NOT EXISTS privacy_level VARCHAR(20) DEFAULT 'FULL' CHECK (privacy_level IN ('FULL', 'LIMITED', 'HIDDEN'));

-- Actualizar propiedades existentes basado en contratos activos
UPDATE properties 
SET 
  visibility = CASE 
    WHEN id IN (
      SELECT DISTINCT property_id 
      FROM contracts 
      WHERE status = 'ACTIVE'
    ) THEN 'PRIVATE'
    ELSE 'PUBLIC'
  END,
  rental_status = CASE 
    WHEN id IN (
      SELECT DISTINCT property_id 
      FROM contracts 
      WHERE status = 'ACTIVE'
    ) THEN 'RENTED'
    ELSE 'AVAILABLE'
  END;

-- Crear tabla de configuración de privacidad por propiedad
CREATE TABLE IF NOT EXISTS property_privacy_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    show_exact_address BOOLEAN DEFAULT FALSE,
    show_owner_contact BOOLEAN DEFAULT TRUE,
    show_price_history BOOLEAN DEFAULT FALSE,
    show_tenant_info BOOLEAN DEFAULT FALSE,
    allow_public_photos BOOLEAN DEFAULT TRUE,
    require_verification BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id)
);

-- Insertar configuraciones por defecto para propiedades existentes
INSERT INTO property_privacy_settings (property_id, show_exact_address, show_owner_contact, allow_public_photos)
SELECT id, 
       CASE WHEN visibility = 'PUBLIC' THEN TRUE ELSE FALSE END,
       CASE WHEN visibility = 'PUBLIC' THEN TRUE ELSE FALSE END,
       CASE WHEN visibility = 'PUBLIC' THEN TRUE ELSE FALSE END
FROM properties
ON CONFLICT (property_id) DO NOTHING;

-- Crear vista para propiedades públicas (solo las disponibles)
CREATE OR REPLACE VIEW public_properties AS
SELECT 
    p.*,
    pps.show_exact_address,
    pps.show_owner_contact,
    pps.allow_public_photos,
    u.first_name,
    u.last_name,
    CASE 
        WHEN pps.show_owner_contact THEN u.phone 
        ELSE NULL 
    END as contact_phone,
    CASE 
        WHEN pps.show_owner_contact THEN u.email 
        ELSE NULL 
    END as contact_email,
    CASE 
        WHEN pps.show_exact_address THEN p.address 
        ELSE CONCAT(p.city, ', ', p.country) 
    END as display_address
FROM properties p
LEFT JOIN property_privacy_settings pps ON p.id = pps.property_id
LEFT JOIN users u ON p.owner_id = u.id
WHERE p.visibility = 'PUBLIC' 
  AND p.rental_status = 'AVAILABLE' 
  AND p.status = 'ACTIVE';

-- Crear vista para propiedades privadas (solo para propietarios e inquilinos)
CREATE OR REPLACE VIEW private_properties AS
SELECT 
    p.*,
    pps.*,
    u.first_name as owner_first_name,
    u.last_name as owner_last_name,
    u.phone as owner_phone,
    u.email as owner_email,
    c.tenant_id,
    c.start_date as rental_start,
    c.end_date as rental_end,
    c.monthly_rent_amount,
    c.monthly_rent_currency,
    tenant.first_name as tenant_first_name,
    tenant.last_name as tenant_last_name
FROM properties p
LEFT JOIN property_privacy_settings pps ON p.id = pps.property_id
LEFT JOIN users u ON p.owner_id = u.id
LEFT JOIN contracts c ON p.id = c.property_id AND c.status = 'ACTIVE'
LEFT JOIN users tenant ON c.tenant_id = tenant.id
WHERE p.visibility = 'PRIVATE' OR p.rental_status = 'RENTED';

-- Función para cambiar automáticamente la visibilidad cuando se firma un contrato
CREATE OR REPLACE FUNCTION update_property_privacy_on_contract()
RETURNS TRIGGER AS $$
BEGIN
    -- Cuando se activa un contrato, hacer la propiedad privada
    IF NEW.status = 'ACTIVE' AND (OLD.status IS NULL OR OLD.status != 'ACTIVE') THEN
        UPDATE properties 
        SET 
            visibility = 'PRIVATE',
            rental_status = 'RENTED',
            updated_at = NOW()
        WHERE id = NEW.property_id;
        
        -- Actualizar configuración de privacidad
        UPDATE property_privacy_settings 
        SET 
            show_exact_address = FALSE,
            show_owner_contact = FALSE,
            show_tenant_info = FALSE,
            updated_at = NOW()
        WHERE property_id = NEW.property_id;
    END IF;
    
    -- Cuando se termina un contrato, hacer la propiedad pública de nuevo
    IF NEW.status IN ('COMPLETED', 'CANCELLED') AND OLD.status = 'ACTIVE' THEN
        UPDATE properties 
        SET 
            visibility = 'PUBLIC',
            rental_status = 'AVAILABLE',
            updated_at = NOW()
        WHERE id = NEW.property_id;
        
        -- Restaurar configuración de privacidad
        UPDATE property_privacy_settings 
        SET 
            show_exact_address = TRUE,
            show_owner_contact = TRUE,
            show_tenant_info = FALSE,
            updated_at = NOW()
        WHERE property_id = NEW.property_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para automatizar cambios de privacidad
DROP TRIGGER IF EXISTS contract_privacy_trigger ON contracts;
CREATE TRIGGER contract_privacy_trigger
    AFTER INSERT OR UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_property_privacy_on_contract();

-- Actualizar políticas RLS para el nuevo sistema de privacidad
DROP POLICY IF EXISTS "Anyone can view active properties" ON properties;

-- Nueva política: solo propiedades públicas son visibles para todos
CREATE POLICY "Public properties visible to all" ON properties
    FOR SELECT USING (
        visibility = 'PUBLIC' 
        AND rental_status = 'AVAILABLE' 
        AND status = 'ACTIVE'
    );

-- Propietarios pueden ver todas sus propiedades
CREATE POLICY "Owners can view own properties" ON properties
    FOR SELECT USING (auth.uid() = owner_id);

-- Inquilinos pueden ver propiedades que rentan
CREATE POLICY "Tenants can view rented properties" ON properties
    FOR SELECT USING (
        id IN (
            SELECT property_id 
            FROM contracts 
            WHERE tenant_id = auth.uid() 
            AND status = 'ACTIVE'
        )
    );

-- Políticas para property_privacy_settings
ALTER TABLE property_privacy_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage privacy settings" ON property_privacy_settings
    FOR ALL USING (
        property_id IN (
            SELECT id FROM properties WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Privacy settings visible to property participants" ON property_privacy_settings
    FOR SELECT USING (
        property_id IN (
            SELECT id FROM properties WHERE owner_id = auth.uid()
        ) OR property_id IN (
            SELECT property_id 
            FROM contracts 
            WHERE tenant_id = auth.uid() 
            AND status = 'ACTIVE'
        )
    );
