-- =====================================================
-- ScoutPro — Esquema PostgreSQL para Supabase
-- Ejecuta este SQL en el editor SQL de tu proyecto Supabase
-- =====================================================

-- Extensión para UUIDs (ya viene activada por defecto en Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------
-- TABLA: jugadores
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS jugadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre_completo VARCHAR(255) NOT NULL,
  fecha_nacimiento DATE,
  pie_dominante VARCHAR(20),
  posicion_principal VARCHAR(50),
  nacionalidad VARCHAR(100),
  club_actual VARCHAR(100),
  altura_cm INT,
  -- Perfil Geográfico del Jugador
  demarcacion_principal VARCHAR(50),
  demarcacion_secundaria VARCHAR(50),
  zonas_influencia INT[],
  tendencias_movimiento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_jugadores_user_id ON jugadores(user_id);
CREATE INDEX IF NOT EXISTS idx_jugadores_posicion ON jugadores(posicion_principal);
CREATE INDEX IF NOT EXISTS idx_jugadores_pie ON jugadores(pie_dominante);
CREATE INDEX IF NOT EXISTS idx_jugadores_nombre ON jugadores USING gin(to_tsvector('spanish', nombre_completo));

-- ---------------------------------------------
-- TABLA: informes
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS informes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE NOT NULL,
  partido_id VARCHAR(255),
  fecha_partido DATE,
  rival VARCHAR(100),
  demarcacion_partido VARCHAR(50),
  zona_accion INT[] DEFAULT '{}',
  tendencias_movimiento TEXT,
  etiquetas TEXT[] DEFAULT '{}',
  metrica_tecnica INT CHECK (metrica_tecnica BETWEEN 1 AND 10),
  metrica_fisica INT CHECK (metrica_fisica BETWEEN 1 AND 10),
  metrica_tactica INT CHECK (metrica_tactica BETWEEN 1 AND 10),
  conclusiones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_informes_jugador_id ON informes(jugador_id);
CREATE INDEX IF NOT EXISTS idx_informes_fecha ON informes(fecha_partido);
CREATE INDEX IF NOT EXISTS idx_informes_etiquetas ON informes USING gin(etiquetas);
CREATE INDEX IF NOT EXISTS idx_informes_zonas ON informes USING gin(zona_accion);

-- =====================================================
-- ROW LEVEL SECURITY (multi-tenancy / SaaS)
-- Cada analista solo puede ver/modificar SUS jugadores e informes
-- =====================================================

ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE informes ENABLE ROW LEVEL SECURITY;

-- Políticas para jugadores (acceso por user_id propio)
DROP POLICY IF EXISTS "Usuarios ven sus jugadores" ON jugadores;
CREATE POLICY "Usuarios ven sus jugadores" ON jugadores
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios crean sus jugadores" ON jugadores;
CREATE POLICY "Usuarios crean sus jugadores" ON jugadores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios actualizan sus jugadores" ON jugadores;
CREATE POLICY "Usuarios actualizan sus jugadores" ON jugadores
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios eliminan sus jugadores" ON jugadores;
CREATE POLICY "Usuarios eliminan sus jugadores" ON jugadores
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para informes (acceso si el jugador padre les pertenece)
DROP POLICY IF EXISTS "Usuarios ven informes de sus jugadores" ON informes;
CREATE POLICY "Usuarios ven informes de sus jugadores" ON informes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM jugadores WHERE jugadores.id = informes.jugador_id AND jugadores.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Usuarios crean informes en sus jugadores" ON informes;
CREATE POLICY "Usuarios crean informes en sus jugadores" ON informes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM jugadores WHERE jugadores.id = informes.jugador_id AND jugadores.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Usuarios actualizan informes de sus jugadores" ON informes;
CREATE POLICY "Usuarios actualizan informes de sus jugadores" ON informes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM jugadores WHERE jugadores.id = informes.jugador_id AND jugadores.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Usuarios eliminan informes de sus jugadores" ON informes;
CREATE POLICY "Usuarios eliminan informes de sus jugadores" ON informes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM jugadores WHERE jugadores.id = informes.jugador_id AND jugadores.user_id = auth.uid())
  );
