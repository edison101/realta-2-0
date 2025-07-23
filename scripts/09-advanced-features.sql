-- Sistema de Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('payment', 'contract', 'property', 'system', 'chat')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sistema de Chat
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sistema de Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  review_type TEXT NOT NULL CHECK (review_type IN ('property', 'owner', 'tenant')),
  is_verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para marcar reviews como útiles
CREATE TABLE IF NOT EXISTS review_helpful (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Sistema de Analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_property_id ON chat_conversations(property_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_owner_id ON chat_conversations(owner_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_tenant_id ON chat_conversations(tenant_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Políticas para notificaciones
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para chat
CREATE POLICY "Users can view their conversations" ON chat_conversations
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = tenant_id);

CREATE POLICY "Users can create conversations" ON chat_conversations
  FOR INSERT WITH CHECK (auth.uid() = owner_id OR auth.uid() = tenant_id);

CREATE POLICY "Users can view messages in their conversations" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_conversations cc 
      WHERE cc.id = chat_messages.conversation_id 
      AND (cc.owner_id = auth.uid() OR cc.tenant_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM chat_conversations cc 
      WHERE cc.id = chat_messages.conversation_id 
      AND (cc.owner_id = auth.uid() OR cc.tenant_id = auth.uid())
    )
  );

-- Políticas para reviews
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can mark reviews as helpful" ON review_helpful
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para analytics (solo sistema)
CREATE POLICY "System can manage analytics" ON analytics_events
  FOR ALL USING (true);

-- Funciones para notificaciones
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_action_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, title, message, type, action_url, metadata)
  VALUES (p_user_id, p_title, p_message, p_type, p_action_url, p_metadata)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar rating promedio de propiedades
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating::DECIMAL), 0) 
      FROM reviews 
      WHERE property_id = COALESCE(NEW.property_id, OLD.property_id)
      AND review_type = 'property'
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE property_id = COALESCE(NEW.property_id, OLD.property_id)
      AND review_type = 'property'
    )
  WHERE id = COALESCE(NEW.property_id, OLD.property_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar rating de propiedades
DROP TRIGGER IF EXISTS trigger_update_property_rating ON reviews;
CREATE TRIGGER trigger_update_property_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_property_rating();

-- Función para crear notificaciones automáticas
CREATE OR REPLACE FUNCTION create_payment_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'succeeded' AND OLD.status != 'succeeded' THEN
    -- Notificar al propietario
    PERFORM create_notification(
      (SELECT owner_id FROM contracts c JOIN properties p ON c.property_id = p.id WHERE c.id = NEW.contract_id),
      'Pago Recibido',
      CASE 
        WHEN NEW.payment_type = 'deposit' THEN 'Has recibido un pago de depósito'
        WHEN NEW.payment_type = 'rent' THEN 'Has recibido un pago de renta mensual'
        ELSE 'Has recibido un pago'
      END,
      'payment',
      '/dashboard/pagos'
    );
    
    -- Notificar al inquilino
    PERFORM create_notification(
      (SELECT tenant_id FROM contracts WHERE id = NEW.contract_id),
      'Pago Procesado',
      CASE 
        WHEN NEW.payment_type = 'deposit' THEN 'Tu depósito ha sido procesado exitosamente'
        WHEN NEW.payment_type = 'rent' THEN 'Tu pago de renta ha sido procesado exitosamente'
        ELSE 'Tu pago ha sido procesado exitosamente'
      END,
      'payment',
      '/dashboard'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificaciones de pago
DROP TRIGGER IF EXISTS trigger_payment_notification ON payments;
CREATE TRIGGER trigger_payment_notification
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION create_payment_notification();

-- Agregar campos de rating a propiedades si no existen
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Datos de ejemplo para testing
INSERT INTO notifications (user_id, title, message, type, action_url) 
SELECT 
  id,
  'Bienvenido a Realta 2.0',
  'Tu cuenta ha sido creada exitosamente. Explora todas las funcionalidades disponibles.',
  'system',
  '/dashboard'
FROM users 
WHERE user_type = 'OWNER'
ON CONFLICT DO NOTHING;
