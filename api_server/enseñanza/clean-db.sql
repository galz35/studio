/*
  Script para limpiar la base de datos completa.
  Instrucciones: Copiar y pegar este contenido en el Editor SQL de Supabase y ejecutar.
  
  ⚠️ ADVERTENCIA: 
  Esto borrará TODOS los datos de las tablas listadas y reiniciará los contadores de ID.
  No se puede deshacer.
*/

TRUNCATE TABLE 
  public.usuarios,
  public.pacientes,
  public.medicos,
  public.empleados,
  public.citas_medicas,
  public.atenciones_medicas,
  public.casos_clinicos,
  public.chequeos_bienestar,
  public.examenes_medicos,
  public.registros_psicosociales,
  public.seguimientos,
  public.vacunas_aplicadas
RESTART IDENTITY CASCADE;

/* 
  Verificación opcional:
  Si todo salió bien, todas las tablas deberían tener 0 filas.
  Descomentar la siguiente línea para verificar los conteos aproximados:
*/
-- SELECT relname as tabla, n_live_tup as filas_aprox FROM pg_stat_user_tables ORDER BY n_live_tup DESC;
