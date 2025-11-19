// All content (labels, texts, messages) in Spanish.

export type Rol = 'PACIENTE' | 'MEDICO' | 'ADMIN';
export type Pais = 'NI' | 'CR' | 'HN';

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
  idMedico?: number;
  idChequeo?: number;
  fechaCita: string; // YYYY-MM-DD
  horaCita: string; // HH:mm
  canalOrigen: 'CHEQUEO' | 'RRHH' | 'DIRECTO';
  estadoCita: 'PROGRAMADA' | 'CONFIRMADA' | 'FINALIZADA' | 'CANCELADA';
  notasCita?: string;
}

export interface AtencionMedica {
  idAtencion: number;
  idCita: number;
  idCaso: number;
  idMedico?: number;
  fechaAtencion: string;
  pesoKg?: number;
  alturaM?: number;
  presionArterial?: string;
  frecuenciaCardiaca?: number;
  temperaturaC?: number;
  diagnosticoMedico: string;
  codigoDiagnostico?: string;
  planTratamiento?: string;
  recomendaciones?: string;
  nivelSemaforo: 'V' | 'A' | 'R';
  requiereSeguimiento?: boolean;
  fechaSugeridaSeguimiento?: string;
  tipoAlta: string;
  estadoAtencion: string;
}

export interface ExamenMedico {
  idExamen: number;
  idCaso: number;
  idAtencion?: number;
  idPaciente: number;
  tipoExamen: string;
  fechaSolicitud: string;
  fechaResultado?: string;
  laboratorio?: string;
  resultadoResumen?: string;
  estadoExamen: 'PENDIENTE' | 'ENTREGADO';
}

export interface SeguimientoPaciente {
  idSeguimiento: number;
  idCaso: number;
  idAtencion?: number;
  idPaciente: number;
  fechaProgramada: string;
  fechaReal?: string;
  tipoSeguimiento: 'LLAMADA' | 'TEAMS' | 'PRESENCIAL';
  estadoSeguimiento: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO';
  nivelSemaforo: 'V' | 'A' | 'R';
  notasSeguimiento?: string;
  usuarioResponsable: string;
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
