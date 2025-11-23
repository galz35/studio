// All content (labels, texts, messages) in Spanish.

export type Rol = 'PACIENTE' | 'MEDICO' | 'ADMIN';
export type Pais = 'NI' | 'CR' | 'HN';

export type EstadoClinico = 'BIEN' | 'REGULAR' | 'MAL';

export interface UsuarioAplicacion {
  idUsuario?: number; // Optional on create
  id?: string; // Firestore ID
  carnet: string;
  rol: Rol;
  estado: 'A' | 'I';
  ultimoAcceso?: string;
  idPaciente?: string; // Should be Firestore ID
  idMedico?: string; // Should be Firestore ID
  nombreCompleto: string; 
  correo?: string;
  pais: Pais;
}

export interface Paciente {
  idPaciente?: number;
  id?: string;
  carnet: string;
  nombreCompleto: string;
  fechaNacimiento?: string;
  sexo?: 'M' | 'F' | 'O';
  telefono?: string;
  correo?: string;
  gerencia?: string;
  area?: string;
  estadoPaciente: 'A' | 'I';
  nivelSemaforo?: 'V' | 'A' | 'R';
  pais: Pais;
}

export interface Medico {
  idMedico?: number;
  id?: string;
  nombreCompleto: string;
  especialidad?: string;
  tipoMedico: 'INTERNO' | 'EXTERNO';
  correo?: string;
  telefono?: string;
  estadoMedico: 'A' | 'I';
  carnet?: string; // For internal doctors
}

export interface ChequeoBienestar {
  idChequeo: number;
  id?: string;
  idPaciente: string;
  fechaRegistro: string;
  estadoAnimo: string;
  ruta: string;
  modalidadTrabajo: string;
  aptoLaboral?: boolean;
  alergiasActivas?: boolean;
  alergiasDescripcion?: string;
  calidadSueno: string;
  consumoAgua: string;
  yaConsultoMedico?: boolean;
  motivoNoAcudirMedico?: string;
  nivelSemaforo: 'V' | 'A' | 'R';
  comentarioGeneral?: string;
  estadoChequeo: string;
}

export interface TriajeIA {
    nivel_urgencia: "Baja" | "Moderada" | "Alta" | "Emergencia";
    especialidad_sugerida: string;
    resumen_medico: string;
    accion_recomendada: string;
}

export interface CasoClinico {
  idCaso?: number;
  id?: string;
  codigoCaso?: string;
  idPaciente: string;
  idCita?: string;
  fechaCreacion: string;
  estadoCaso: string;
  nivelSemaforo: 'V' | 'A' | 'R';
  motivoConsulta: string;
  resumenClinicoUsuario?: string;
  diagnosticoUsuario?: string;
  datosExtra?: any; // To store the full payload from the wizard
  pais: Pais;
  triajeIA?: TriajeIA | null;
}

export interface CitaMedica {
  idCita?: number;
  id?: string;
  idCaso?: string;
  idPaciente: string;
  idMedico: string;
  fechaCita: string; // YYYY-MM-DD
  horaCita: string; // HH:mm
  canalOrigen: 'CHEQUEO' | 'RRHH' | 'OTRO' | 'SOLICITUD' | 'AGENDADA_POR_MEDICO';
  estadoCita: 'PROGRAMADA' | 'CONFIRMADA' | 'EN_ATENCION' | 'FINALIZADA' | 'CANCELADA';
  motivoResumen: string;
  nivelSemaforoPaciente: 'V' | 'A' | 'R';
  pais: Pais;
}

export interface AtencionMedica {
  idAtencion: number;
  id?: string;
  idCita: string;
  idCaso?: string;
  idMedico: string;
  fechaAtencion: string; // ISO
  temperaturaC?: number;
  pesoKg?: number;
  alturaM?: number;
  presionArterial?: string;
  frecuenciaCardiaca?: number;
  estadoClinico: EstadoClinico; // BIEN / REGULAR / MAL
  diagnosticoPrincipal: string;
  planTratamiento?: string;
  recomendaciones?: string;
  requiereSeguimiento: boolean;
  fechaSiguienteCita?: string; // solo si requiereSeguimiento
  tipoSiguienteCita?: 'CONTROL' | 'RESULTADO_EXAMEN' | 'OTRO';
  notasSeguimientoMedico?: string;
}

export interface VacunaAplicada {
  idVacunaRegistro: number;
  id?: string;
  idPaciente: string;
  idMedico: string;
  idAtencion?: string; // Optional: can be registered outside a consultation
  tipoVacuna: string; // Influenza, COVID, Hepatitis, etc.
  dosis: string; // 1ra dosis, refuerzo, etc.
  fechaAplicacion: string;
  observaciones?: string;
}

export interface RegistroPsicosocial {
  idRegistroPsico: number;
  id?: string;
  idAtencion: string;
  nivelEstrés?: 'BAJO' | 'MEDIO' | 'ALTO';
  sintomasPsico?: string[]; // Ej: ['Ansiedad', 'Insomnio', 'Tristeza']
  riesgoSuicida?: boolean;
  derivarAPsico?: boolean;
  notasPsico?: string;
  confidencial?: boolean; // Indica si es info sensible
}

export interface SeguimientoGenerado {
  idSeguimiento: number;
  id?: string;
  idCaso?: string;
  idAtencion: string;
  idPaciente: string;
  fechaProgramada: string;
  motivo: string;
  estadoInicial: 'PENDIENTE';
  estadoClinicoAlProgramar: EstadoClinico;
}

export interface EmpleadoEmp2024 {
  id?: string;
  carnet: string;
  nombreCompleto: string;
  correo: string;
  cargo: string;
  gerencia: string;
  subgerencia: string;
  area: string;
  telefono: string;
  nomJefe: string;
  correoJefe: string;
  carnetJefe: string;
  pais: Pais;
  fechaNacimiento: string; // YYYY-MM-DD
  fechaContratacion: string; // YYYY-MM-DD
  estado: 'ACTIVO' | 'INACTIVO'; // Replaces fechabaja for more flexibility
}


export interface SeguimientoPaciente {
  idSeguimiento: number;
  id?: string;
  idCaso: string;
  idPaciente: string;
  fechaProgramada: string;
  fechaReal?: string;
  tipoSeguimiento: 'LLAMADA' | 'TEAMS' | 'PRESENCIAL';
  estadoSeguimiento: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO' | 'CANCELADO';
  nivelSemaforo: 'V' | 'A' | 'R';
  usuarioResponsable: string;
  notasSeguimiento: string;
}

export interface ExamenMedico {
  idExamen: number;
  id?: string;
  idCaso?: string;
  idAtencion?: string;
  idPaciente: string;
  tipoExamen: string;
  fechaSolicitud: string;
  fechaResultado?: string;
  laboratorio: string;
  resultadoResumen?: string;
  estadoExamen: 'PENDIENTE' | 'ENTREGADO' | 'CANCELADO';
}
