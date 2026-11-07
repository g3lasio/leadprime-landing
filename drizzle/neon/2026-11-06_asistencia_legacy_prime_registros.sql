-- Asistencia (check-in) en la tabla única de registrados Legacy Prime.
-- Pedido del dueño (6-nov-2026): marcar la asistencia con un checkbox
-- en /admin/registrados, guardado en la base y reutilizable en todos
-- los eventos futuros del tour (cada fila ES el registro de un evento:
-- su enlace + ciudad_evento; por eso el booleano vive en la fila).
--
-- Migración ADITIVA aplicada en producción el 6-nov-2026 contra la
-- Neon compartida (la misma de la app LeadPrime): no toca ni reescribe
-- ninguna fila existente; todo registro nace con asistio = false.
-- La app solo lee columnas explícitas, así que las nuevas columnas no
-- la afectan. El timestamp guarda el momento del check-in (hora del
-- servidor) y vuelve a NULL al desmarcar.

ALTER TABLE legacy_prime_registros
  ADD COLUMN IF NOT EXISTS asistio boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS asistio_at timestamp with time zone;
