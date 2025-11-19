export type RutaMotivo = 'bien' | 'consulta';

export type TriageNivel = 'VERDE' | 'AMARILLO' | 'ROJO';

export type ModalidadTrabajo = 'Oficina' | 'Remoto' | 'Vacaciones';

export interface AlergiaInfo {
  activa: boolean | null;
  descripcion?: string | null;
}

export interface HabitosInfo {
  sueno?: 'Bien' | 'Regular' | 'Mal' | 'Prefiero no decir' | null;
  hidratacion?: 'Sí' | 'Poco' | 'Aún no' | null;
}

export interface DetalleSintoma {
  Intensidad?: number; // 0–10
  Lado?: 'Izquierdo' | 'Derecho' | 'Ambos';
  Duracion?: string;
  Frecuencia?: 'Ocasional' | 'A ratos' | 'Frecuente';
  Desencadenantes?: string[];
  Notas?: string;
}

export interface DatosExtraJSON {
  Ruta: RutaMotivo | null;
  Modalidad: ModalidadTrabajo | null;
  Categorias: string[];
  Sintomas: string[];
  SintomasKeys: string[]; // keys internos de cada síntoma
  Detalles: Record<string, DetalleSintoma>;
  Alergia: AlergiaInfo;
  Habitos: HabitosInfo;
  Insumos: string[];
}

export interface SolicitudCitaPayload {
  Ruta: RutaMotivo | null;
  Modalidad: ModalidadTrabajo | null;
  AptoLaboral: boolean | null;
  AlergiasActivas: boolean | null;
  AlergiasDescripcion?: string | null;
  Triage: TriageNivel | null;
  Comentario?: string | null;
  DatosExtraJSON: DatosExtraJSON;
}
