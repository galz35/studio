// All content (labels, texts, messages) in Spanish.

export type Rol = 'PACIENTE' | 'MEDICO' | 'ADMIN';
export type Pais = 'NI' | 'CR' | 'HN';

export type EstadoClinico = 'BIEN' | 'REGULAR' | 'MAL';

export interface UsuarioAplicacion {
  idUsuario: number;
  carnet: string;
  rol: Rol;
  estado: 'A' | 'I';
  ultimoAcceso?: string;
  idPaciente?: number;
  idMedico?: number;
  nombreCompleto: string; // Added from Empleado mock
  pais: Pais;
}

export interface Paciente {
  idPaciente: number;
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
}

export interface Medico {
  idMedico: number;
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
  idPaciente: number;
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

export interface CasoClinico {
  idCaso: number;
  codigoCaso: string;
  idPaciente: number;
  idCita?: number;
  fechaCreacion: string;
  estadoCaso: string;
  nivelSemaforo: 'V' | 'A' | 'R';
  motivoConsulta: string;
  resumenClinicoUsuario?: string;
  diagnosticoUsuario?: string;
}

export interface CitaMedica {
  idCita: number;
  idCaso?: number;
  idPaciente: number;
  idMedico: number;
  fechaCita: string; // YYYY-MM-DD
  horaCita: string; // HH:mm
  canalOrigen: 'CHEQUEO' | 'RRHH' | 'OTRO' | 'SOLICITUD';
  estadoCita: 'PROGRAMADA' | 'EN_ATENCION' | 'FINALIZADA' | 'CANCELADA';
  motivoResumen: string;
  nivelSemaforoPaciente: 'V' | 'A' | 'R';
}

export interface AtencionMedica {
  idAtencion: number;
  idCita: number;
  idCaso?: number;
  idMedico: number;
  fechaAtencion: string; // ISO
  temperaturaC?: number;
  pesoKg?: number;
  alturaM?: number;
  presionArterial?: string;
  frecuenciaCardiaca?: number;
  estadoClinico: EstadoClinico; // BIEN / REGULAR / MAL
  diagnosticoPrincipal: string;
  codDiagnostico?: string;
  planTratamiento?: string;
  recomendaciones?: string;
  requiereSeguimiento: boolean;
  fechaSiguienteCita?: string; // solo si requiereSeguimiento
  tipoSiguienteCita?: 'CONTROL' | 'RESULTADO_EXAMEN' | 'OTRO';
  notasSeguimientoMedico?: string;
}

export interface VacunaAplicada {
  idVacunaRegistro: number;
  idAtencion: number;
  tipoVacuna: string; // Influenza, COVID, Hepatitis, etc.
  dosis: string; // 1ra dosis, refuerzo, etc.
  fechaAplicacion: string;
  observaciones?: string;
}

export interface RegistroPsicosocial {
  idRegistroPsico: number;
  idAtencion: number;
  nivelEstrés?: 'BAJO' | 'MEDIO' | 'ALTO';
  sintomasPsico?: string[]; // Ej: ['Ansiedad', 'Insomnio', 'Tristeza']
  riesgoSuicida?: boolean;
  derivarAPsico?: boolean;
  notasPsico?: string;
  confidencial?: boolean; // Indica si es info sensible
}

export interface SeguimientoGenerado {
  idSeguimiento: number;
  idCaso?: number;
  idAtencion: number;
  idPaciente: number;
  fechaProgramada: string;
  motivo: string;
  estadoInicial: 'PENDIENTE';
  estadoClinicoAlProgramar: EstadoClinico;
}

export interface EmpleadoEmp2024 {
  carnet: string;
  nombreCompleto: string;
  correo: string;
  cargo: string;
  gerencia: string;
  area: string;
  telefono: string;
  nomJefe: string;
  correoJefe: string;
  carnetJefe: string;
  pais: Pais;
}

export interface SeguimientoPaciente {
  idSeguimiento: number;
  idCaso: number;
  idPaciente: number;
  fechaProgramada: string;
  fechaReal?: string;
  tipoSeguimiento: 'LLAMADA' | 'TEAMS' | 'PRESENCIAL';
  estadoSeguimiento: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO' | 'CANCELADO';
  nivelSemaforo: 'V' | 'A' | 'R';
  usuarioResponsable: string;
  notasSeguimiento: string;
}
