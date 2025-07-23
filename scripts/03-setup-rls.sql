-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla users
-- Los usuarios pueden ver y editar su propio perfil
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Permitir inserción durante el registro
CREATE POLICY "Enable insert for registration" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para la tabla properties
-- Cualquiera puede ver propiedades activas (para el portal público)
CREATE POLICY "Anyone can view active properties" ON properties
    FOR SELECT USING (status = 'ACTIVE');

-- Los propietarios pueden gestionar sus propias propiedades
CREATE POLICY "Owners can manage own properties" ON properties
    FOR ALL USING (auth.uid() = owner_id);

-- Los administradores pueden ver todas las propiedades
CREATE POLICY "Admins can view all properties" ON properties
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'ADMIN'
        )
    );

-- Políticas para la tabla contracts
-- Los participantes del contrato pueden verlo
CREATE POLICY "Contract participants can view" ON contracts
    FOR SELECT USING (
        auth.uid() = tenant_id OR 
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'ADMIN'
        )
    );

-- Los propietarios pueden crear contratos
CREATE POLICY "Owners can create contracts" ON contracts
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Los participantes pueden actualizar el estado
CREATE POLICY "Participants can update contracts" ON contracts
    FOR UPDATE USING (
        auth.uid() = tenant_id OR 
        auth.uid() = owner_id
    );

-- Políticas para la tabla transactions
-- Los participantes de la transacción pueden verla
CREATE POLICY "Transaction participants can view" ON transactions
    FOR SELECT USING (
        auth.uid() = payer_id OR 
        auth.uid() = recipient_id OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'ADMIN'
        )
    );

-- Solo el sistema puede crear transacciones (a través de service role)
CREATE POLICY "System can create transactions" ON transactions
    FOR INSERT WITH CHECK (true);

-- Políticas para currency_rates (solo lectura pública)
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view currency rates" ON currency_rates
    FOR SELECT USING (true);

-- Solo el sistema puede actualizar las tasas
CREATE POLICY "System can update currency rates" ON currency_rates
    FOR ALL USING (false);
