-- =====================================================
-- MIGRACIÓN: Añadir campos de contacto a jugadores
-- Ejecuta este SQL en el editor SQL de Supabase UNA sola vez
-- =====================================================

ALTER TABLE jugadores
  ADD COLUMN IF NOT EXISTS telefono VARCHAR(30),
  ADD COLUMN IF NOT EXISTS email VARCHAR(150),
  ADD COLUMN IF NOT EXISTS contacto_familiar VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contacto_manager VARCHAR(255);
