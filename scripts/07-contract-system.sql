-- Sistema de Contratos y Solicitudes de Renta
-- Fase 6: Implementación completa del sistema de contratos

-- Tabla de solicitudes de renta
CREATE TABLE rental_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Información personal del solicitante
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  identification_number VARCHAR(50),
  identification_type VARCHAR(20) DEFAULT 'DPI', -- DPI, CEDULA, PASSPORT
  
  -- Información laboral
  employment_status VARCHAR(20) DEFAULT 'EMPLOYED', -- EMPLOYED, SELF_EMPLOYED, UNEMPLOYED, STUDENT, RETIRED
  employer_name VARCHAR(200),
  job_title VARCHAR(100),
  monthly_income_amount INTEGER, -- En centavos
  monthly_income_currency VARCHAR(3) DEFAULT 'USD',
  employment_duration_months INTEGER,
  
  -- Referencias
  personal_reference_name VARCHAR(200),
  personal_reference_phone VARCHAR(20),
  personal_reference_relationship VARCHAR(100),
  
  previous_landlord_name VARCHAR(200),
  previous_landlord_phone VARCHAR(20),
  previous_rental_address TEXT,
  
  -- Contacto de emergencia
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(100),
  
  -- Términos propuestos
  desired_start_date DATE NOT NULL,
  desired_lease_duration_months INTEGER DEFAULT 12,
  proposed_monthly_rent_amount INTEGER, -- En centavos
  proposed_monthly_rent_currency VARCHAR(3) DEFAULT 'USD',
  
  -- Estado y notas
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, WITHDRAWN
  owner_notes TEXT,
  tenant_notes TEXT,
  
  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES users(id)
);

-- Tabla de plantillas de contratos
CREATE TABLE contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  country VARCHAR(2) NOT NULL, -- GT, MX, etc.
  property_type VARCHAR(20) NOT NULL, -- RESIDENTIAL, COMMERCIAL
  template_content TEXT NOT NULL, -- HTML/Markdown con placeholders
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Actualizar tabla de contratos existente
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS application_id UUID REFERENCES rental_applications(id);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES contract_templates(id);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS contract_content TEXT;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS signed_by_tenant_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS signed_by_owner_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS tenant_signature_data JSONB;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS owner_signature_data JSONB;

-- Índices para optimización
CREATE INDEX idx_rental_applications_property_id ON rental_applications(property_id);
CREATE INDEX idx_rental_applications_tenant_id ON rental_applications(tenant_id);
CREATE INDEX idx_rental_applications_owner_id ON rental_applications(owner_id);
CREATE INDEX idx_rental_applications_status ON rental_applications(status);
CREATE INDEX idx_rental_applications_created_at ON rental_applications(created_at);

CREATE INDEX idx_contract_templates_country ON contract_templates(country);
CREATE INDEX idx_contract_templates_property_type ON contract_templates(property_type);
CREATE INDEX idx_contract_templates_active ON contract_templates(is_active);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_rental_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rental_applications_updated_at
  BEFORE UPDATE ON rental_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_rental_applications_updated_at();

-- Función para crear contrato automáticamente cuando se aprueba una solicitud
CREATE OR REPLACE FUNCTION create_contract_from_application()
RETURNS TRIGGER AS $$
DECLARE
  template_record contract_templates%ROWTYPE;
  property_record properties%ROWTYPE;
  contract_id UUID;
BEGIN
  -- Solo proceder si el estado cambió a APPROVED
  IF NEW.status = 'APPROVED' AND OLD.status != 'APPROVED' THEN
    
    -- Obtener información de la propiedad
    SELECT * INTO property_record FROM properties WHERE id = NEW.property_id;
    
    -- Buscar plantilla apropiada
    SELECT * INTO template_record 
    FROM contract_templates 
    WHERE country = property_record.country 
      AND property_type = 'RESIDENTIAL' 
      AND is_active = true 
    LIMIT 1;
    
    -- Crear el contrato
    INSERT INTO contracts (
      property_id,
      owner_id,
      tenant_id,
      application_id,
      template_id,
      start_date,
      end_date,
      monthly_rent_amount,
      monthly_rent_currency,
      deposit_amount,
      deposit_currency,
      status,
      contract_content
    ) VALUES (
      NEW.property_id,
      NEW.owner_id,
      NEW.tenant_id,
      NEW.id,
      template_record.id,
      NEW.desired_start_date,
      NEW.desired_start_date + INTERVAL '1 month' * NEW.desired_lease_duration_months,
      COALESCE(NEW.proposed_monthly_rent_amount, property_record.price_amount),
      COALESCE(NEW.proposed_monthly_rent_currency, property_record.price_currency),
      COALESCE(NEW.proposed_monthly_rent_amount, property_record.price_amount), -- Depósito = 1 mes de renta
      COALESCE(NEW.proposed_monthly_rent_currency, property_record.price_currency),
      'PENDING_SIGNATURE',
      template_record.template_content
    ) RETURNING id INTO contract_id;
    
    -- Actualizar estado de la propiedad
    UPDATE properties 
    SET status = 'RENTED', 
        rental_status = 'RENTED',
        updated_at = NOW()
    WHERE id = NEW.property_id;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_contract_from_application
  AFTER UPDATE ON rental_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_contract_from_application();

-- RLS Policies para rental_applications
ALTER TABLE rental_applications ENABLE ROW LEVEL SECURITY;

-- Los inquilinos pueden ver y crear sus propias solicitudes
CREATE POLICY "Tenants can view own applications" ON rental_applications
  FOR SELECT USING (tenant_id = auth.uid());

CREATE POLICY "Tenants can create applications" ON rental_applications
  FOR INSERT WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Tenants can update own pending applications" ON rental_applications
  FOR UPDATE USING (tenant_id = auth.uid() AND status = 'PENDING');

-- Los propietarios pueden ver y gestionar solicitudes de sus propiedades
CREATE POLICY "Owners can view applications for their properties" ON rental_applications
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Owners can update applications for their properties" ON rental_applications
  FOR UPDATE USING (owner_id = auth.uid());

-- RLS Policies para contract_templates
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;

-- Solo administradores pueden gestionar plantillas (por ahora, todos pueden leer)
CREATE POLICY "Anyone can view active templates" ON contract_templates
  FOR SELECT USING (is_active = true);

-- Insertar plantillas de contratos básicas
INSERT INTO contract_templates (name, country, property_type, template_content) VALUES 
(
  'Contrato de Arrendamiento Residencial - Guatemala',
  'GT',
  'RESIDENTIAL',
  '
  <div class="contract-template">
    <h1>CONTRATO DE ARRENDAMIENTO</h1>
    
    <p><strong>ARRENDADOR:</strong> {{owner_name}}<br>
    DPI: {{owner_identification}}<br>
    Dirección: {{owner_address}}<br>
    Teléfono: {{owner_phone}}</p>
    
    <p><strong>ARRENDATARIO:</strong> {{tenant_name}}<br>
    DPI: {{tenant_identification}}<br>
    Teléfono: {{tenant_phone}}</p>
    
    <p><strong>INMUEBLE:</strong><br>
    Dirección: {{property_address}}<br>
    Tipo: {{property_type}}<br>
    Área: {{property_area}} m²</p>
    
    <h2>CLÁUSULAS</h2>
    
    <p><strong>PRIMERA:</strong> El arrendador da en arrendamiento al arrendatario el inmueble descrito, quien lo acepta en las condiciones que se estipulan en este contrato.</p>
    
    <p><strong>SEGUNDA:</strong> El plazo del arrendamiento será de {{lease_duration}} meses, iniciando el {{start_date}} y finalizando el {{end_date}}.</p>
    
    <p><strong>TERCERA:</strong> La renta mensual será de {{monthly_rent}} {{currency}}, pagadera por adelantado dentro de los primeros cinco días de cada mes.</p>
    
    <p><strong>CUARTA:</strong> El arrendatario pagará un depósito de garantía de {{deposit_amount}} {{currency}} para responder por daños y perjuicios.</p>
    
    <p><strong>QUINTA:</strong> El arrendatario se obliga a:</p>
    <ul>
      <li>Pagar puntualmente la renta</li>
      <li>Conservar el inmueble en buen estado</li>
      <li>No subarrendar sin autorización</li>
      <li>Permitir inspecciones con previo aviso</li>
    </ul>
    
    <p>En fe de lo cual, las partes firman el presente contrato en la ciudad de {{city}}, el {{contract_date}}.</p>
    
    <div class="signatures">
      <div class="signature-block">
        <p>_________________________</p>
        <p>{{owner_name}}<br>ARRENDADOR</p>
      </div>
      
      <div class="signature-block">
        <p>_________________________</p>
        <p>{{tenant_name}}<br>ARRENDATARIO</p>
      </div>
    </div>
  </div>
  '
),
(
  'Contrato de Arrendamiento Residencial - México',
  'MX',
  'RESIDENTIAL',
  '
  <div class="contract-template">
    <h1>CONTRATO DE ARRENDAMIENTO DE FINCA URBANA</h1>
    
    <p><strong>ARRENDADOR:</strong> {{owner_name}}<br>
    RFC: {{owner_rfc}}<br>
    CURP: {{owner_curp}}<br>
    Domicilio: {{owner_address}}</p>
    
    <p><strong>ARRENDATARIO:</strong> {{tenant_name}}<br>
    RFC: {{tenant_rfc}}<br>
    CURP: {{tenant_curp}}<br>
    Domicilio: {{tenant_address}}</p>
    
    <p><strong>INMUEBLE OBJETO DEL CONTRATO:</strong><br>
    Ubicación: {{property_address}}<br>
    Tipo: {{property_type}}<br>
    Superficie: {{property_area}} m²</p>
    
    <h2>DECLARACIONES</h2>
    
    <p><strong>I.</strong> Declara el ARRENDADOR que es propietario del inmueble descrito.</p>
    
    <p><strong>II.</strong> Declara el ARRENDATARIO que conoce las condiciones físicas del inmueble.</p>
    
    <h2>CLÁUSULAS</h2>
    
    <p><strong>PRIMERA.- OBJETO:</strong> El ARRENDADOR otorga en arrendamiento al ARRENDATARIO el inmueble descrito en las declaraciones.</p>
    
    <p><strong>SEGUNDA.- VIGENCIA:</strong> El presente contrato tendrá una vigencia de {{lease_duration}} meses, del {{start_date}} al {{end_date}}.</p>
    
    <p><strong>TERCERA.- RENTA:</strong> El ARRENDATARIO pagará una renta mensual de ${{monthly_rent}} {{currency}} MXN, por adelantado, dentro de los primeros 5 días de cada mes.</p>
    
    <p><strong>CUARTA.- DEPÓSITO:</strong> El ARRENDATARIO entrega un depósito en garantía por ${{deposit_amount}} {{currency}} MXN.</p>
    
    <p><strong>QUINTA.- OBLIGACIONES DEL ARRENDATARIO:</strong></p>
    <ul>
      <li>Pagar puntualmente la renta</li>
      <li>Usar el inmueble conforme a su destino</li>
      <li>Conservar el inmueble en buen estado</li>
      <li>No ceder ni subarrendar sin consentimiento</li>
    </ul>
    
    <p>Firmado en {{city}}, {{state}}, el {{contract_date}}.</p>
    
    <div class="signatures">
      <div class="signature-block">
        <p>_________________________</p>
        <p>{{owner_name}}<br>ARRENDADOR</p>
      </div>
      
      <div class="signature-block">
        <p>_________________________</p>
        <p>{{tenant_name}}<br>ARRENDATARIO</p>
      </div>
    </div>
  </div>
  '
);

-- Función para generar contenido de contrato con datos reales
CREATE OR REPLACE FUNCTION generate_contract_content(contract_id UUID)
RETURNS TEXT AS $$
DECLARE
  contract_record contracts%ROWTYPE;
  property_record properties%ROWTYPE;
  owner_record users%ROWTYPE;
  tenant_record users%ROWTYPE;
  template_record contract_templates%ROWTYPE;
  generated_content TEXT;
BEGIN
  -- Obtener todos los datos necesarios
  SELECT * INTO contract_record FROM contracts WHERE id = contract_id;
  SELECT * INTO property_record FROM properties WHERE id = contract_record.property_id;
  SELECT * INTO owner_record FROM users WHERE id = contract_record.owner_id;
  SELECT * INTO tenant_record FROM users WHERE id = contract_record.tenant_id;
  SELECT * INTO template_record FROM contract_templates WHERE id = contract_record.template_id;
  
  -- Generar contenido reemplazando placeholders
  generated_content := template_record.template_content;
  
  -- Reemplazar datos del propietario
  generated_content := REPLACE(generated_content, '{{owner_name}}', COALESCE(owner_record.first_name || ' ' || owner_record.last_name, 'N/A'));
  generated_content := REPLACE(generated_content, '{{owner_phone}}', COALESCE(owner_record.phone, 'N/A'));
  generated_content := REPLACE(generated_content, '{{owner_identification}}', 'N/A');
  generated_content := REPLACE(generated_content, '{{owner_address}}', 'N/A');
  generated_content := REPLACE(generated_content, '{{owner_rfc}}', 'N/A');
  generated_content := REPLACE(generated_content, '{{owner_curp}}', 'N/A');
  
  -- Reemplazar datos del inquilino
  generated_content := REPLACE(generated_content, '{{tenant_name}}', COALESCE(tenant_record.first_name || ' ' || tenant_record.last_name, 'N/A'));
  generated_content := REPLACE(generated_content, '{{tenant_phone}}', COALESCE(tenant_record.phone, 'N/A'));
  generated_content := REPLACE(generated_content, '{{tenant_identification}}', 'N/A');
  generated_content := REPLACE(generated_content, '{{tenant_address}}', 'N/A');
  generated_content := REPLACE(generated_content, '{{tenant_rfc}}', 'N/A');
  generated_content := REPLACE(generated_content, '{{tenant_curp}}', 'N/A');
  
  -- Reemplazar datos de la propiedad
  generated_content := REPLACE(generated_content, '{{property_address}}', property_record.address);
  generated_content := REPLACE(generated_content, '{{property_type}}', property_record.property_type);
  generated_content := REPLACE(generated_content, '{{property_area}}', COALESCE(property_record.area_sqm::TEXT, 'N/A'));
  generated_content := REPLACE(generated_content, '{{city}}', property_record.city);
  generated_content := REPLACE(generated_content, '{{state}}', COALESCE(property_record.state, ''));
  
  -- Reemplazar datos del contrato
  generated_content := REPLACE(generated_content, '{{start_date}}', contract_record.start_date::TEXT);
  generated_content := REPLACE(generated_content, '{{end_date}}', contract_record.end_date::TEXT);
  generated_content := REPLACE(generated_content, '{{lease_duration}}', EXTRACT(MONTH FROM AGE(contract_record.end_date, contract_record.start_date))::TEXT);
  generated_content := REPLACE(generated_content, '{{monthly_rent}}', (contract_record.monthly_rent_amount / 100)::TEXT);
  generated_content := REPLACE(generated_content, '{{currency}}', contract_record.monthly_rent_currency);
  generated_content := REPLACE(generated_content, '{{deposit_amount}}', (contract_record.deposit_amount / 100)::TEXT);
  generated_content := REPLACE(generated_content, '{{contract_date}}', NOW()::DATE::TEXT);
  
  RETURN generated_content;
END;
$$ LANGUAGE plpgsql;
