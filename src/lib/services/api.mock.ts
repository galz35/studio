// This file is now mostly deprecated as we move to Firestore.
// It can be removed once all modules are migrated.

import { 
  pacientes as mockPacientes,
  chequeos as mockChequeos,
  citas as mockCitas,
  casosClinicos as mockCasos,
  atenciones as mockAtenciones,
  examenes as mockExamenes,
  seguimientos as mockSeguimientos,
  medicos as mockMedicos,
  registrosPsicosociales as mockPsico,
  vacunasAplicadas as mockVacunas,
  seguimientosGenerados as mockSeguimientosGenerados,
} from '@/lib/mock/index';

import type { 
  Paciente, 
  ChequeoBienestar, 
  CitaMedica, 
  CasoClinico, 
  AtencionMedica, 
  ExamenMedico, 
  SeguimientoPaciente,
  Medico,
  UsuarioAplicacion,
  EmpleadoEmp2024,
  Rol,
  Pais,
  VacunaAplicada,
  RegistroPsicosocial,
  SeguimientoGenerado,
} from '@/lib/types/domain';
import type { SolicitudCitaPayload } from '@/lib/types/solicitud';


// --- Paciente Services ---

export const getPacientePorCarnet = (carnet: string): Promise<Paciente | null> => {
  const paciente = mockPacientes.find(p => p.carnet === carnet) || null;
  return Promise.resolve(paciente);
};

export const getChequeosPorPaciente = (idPaciente: number, filters?: { dateRange?: [Date, Date], semaforo?: string }): Promise<ChequeoBienestar[]> => {
  let chequeos = mockChequeos.filter(c => c.idPaciente === idPaciente);
  if (filters?.semaforo) {
    chequeos = chequeos.filter(c => c.nivelSemaforo === filters.semaforo);
  }
  // date filtering logic can be added here
  return Promise.resolve(chequeos.sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()));
};

export const getCitasPorPaciente = (idPaciente: number): Promise<CitaMedica[]> => {
  const citas = mockCitas.filter(c => c.idPaciente === idPaciente);
  return Promise.resolve(citas.sort((a, b) => new Date(b.fechaCita).getTime() - new Date(a.fechaCita).getTime()));
};

export const getExamenesPorPaciente = (idPaciente: number): Promise<ExamenMedico[]> => {
    const examenes = mockExamenes.filter(ex => ex.idPaciente === idPaciente);
    return Promise.resolve(examenes.sort((a,b) => new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime()));
}

export const getVacunasPorPaciente = (idPaciente: number): Promise<VacunaAplicada[]> => {
    const vacunas = mockVacunas.filter(v => v.idPaciente === idPaciente);
    return Promise.resolve(vacunas.sort((a,b) => new Date(b.fechaAplicacion).getTime() - new Date(a.fechaAplicacion).getTime()));
}

export const crearChequeo = (input: Omit<ChequeoBienestar, 'idChequeo' | 'fechaRegistro'>): Promise<ChequeoBienestar> => {
  const nuevoChequeo: ChequeoBienestar = {
    ...input,
    idChequeo: mockChequeos.length + 1,
    fechaRegistro: new Date().toISOString(),
  };
  mockChequeos.unshift(nuevoChequeo); // Add to the beginning of the array
  return Promise.resolve(nuevoChequeo);
};

// --- Medico Services ---

export const getCitaPorId = (idCita: number): Promise<CitaMedica | null> => {
  return Promise.resolve(mockCitas.find(c => c.idCita === idCita) || null);
}

export const getPacientePorId = (idPaciente: number): Promise<Paciente | null> => {
    return Promise.resolve(mockPacientes.find(p => p.idPaciente === idPaciente) || null);
}


export const guardarAtencionCompleta = (payload: { atencion: AtencionMedica; vacunas: VacunaAplicada[]; psico: RegistroPsicosocial | null; seguimientos: SeguimientoGenerado[] }): Promise<{ ok: boolean }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const { atencion, vacunas, psico, seguimientos } = payload;
            
            // "Save" atencion
            mockAtenciones.push(atencion);

            // "Save" vacunas
            vacunas.forEach(v => mockVacunas.push(v));

            // "Save" psico
            if (psico && (psico.nivelEstrés || psico.sintomasPsico?.length || psico.notasPsico)) {
                mockPsico.push(psico);
            }

            // "Save" seguimientos
            seguimientos.forEach(s => mockSeguimientosGenerados.push(s));
            
            // Update cita status
            const cita = mockCitas.find(c => c.idCita === atencion.idCita);
            if (cita) {
                cita.estadoCita = 'FINALIZADA';
            }

            resolve({ ok: true });
        }, 500); // Simulate network delay
    });
}


export const getCitasPorMedico = (idMedico: number, filters?: { dateRange?: [Date, Date], estado?: string, semaforo?: 'V' | 'A' | 'R', pais?: Pais }): Promise<(CitaMedica & {paciente: Paciente})[]> => {
    let citas = mockCitas.filter(c => c.idMedico === idMedico);
    
    const citasConPaciente = citas.map(cita => {
        const paciente = mockPacientes.find(p => p.idPaciente === cita.idPaciente)!;
        return { ...cita, paciente };
    });

    return Promise.resolve(citasConPaciente.sort((a, b) => new Date(a.fechaCita).getTime() - new Date(b.fechaCita).getTime()));
};

export const getDashboardMedico = (idMedico: number, pais: Pais): Promise<{
  kpis: {
    citasHoy: number,
    pacientesEnRojo: number,
    seguimientosPendientes: number,
    examenesSinResultado: number,
  },
  citasDelDia: (CitaMedica & {paciente: Paciente, caso: CasoClinico | null})[],
  alertas: { message: string, type: 'danger' | 'warning' }[]
}> => {
    const hoy = new Date().toISOString().split('T')[0];
    const citasHoy = mockCitas.filter(c => c.idMedico === idMedico && c.fechaCita === hoy);
    
    const kpis = {
      citasHoy: citasHoy.length,
      pacientesEnRojo: 1, // mock
      seguimientosPendientes: mockSeguimientos.filter(s => s.estadoSeguimiento === 'PENDIENTE').length,
      examenesSinResultado: mockExamenes.filter(e => e.estadoExamen === 'PENDIENTE').length,
    }

    const citasDelDia = citasHoy.map(cita => {
        const paciente = mockPacientes.find(p => p.idPaciente === cita.idPaciente)!;
        const caso = mockCasos.find(c => c.idCita === cita.idCita) || null;
        return { ...cita, paciente, caso };
    });
    
    const alertas = [
      { message: 'Luis García ha reportado semáforo ROJO por 3 días seguidos.', type: 'danger' as const },
      { message: 'Seguimiento de Mariana López está vencido.', type: 'warning' as const },
    ];
    
    return Promise.resolve({ kpis, citasDelDia, alertas });
};

export const getCasoClinicoDetalle = (idCaso: number): Promise<(CasoClinico & {paciente: Paciente, atenciones: AtencionMedica[], examenes: ExamenMedico[], seguimientos: SeguimientoPaciente[]}) | null> => {
  const caso = mockCasos.find(c => c.idCaso === idCaso);
  if (!caso) return Promise.resolve(null);
  
  const paciente = mockPacientes.find(p => p.idPaciente === caso.idPaciente)!;
  const atenciones = mockAtenciones.filter(a => a.idCaso === idCaso);
  const examenes = mockExamenes.filter(e => e.idCaso === idCaso);
  const seguimientos = mockSeguimientos.filter(s => s.idCaso === idCaso);
  
  return Promise.resolve({ ...caso, paciente, atenciones, examenes, seguimientos });
}

export const getAtencionMedicaData = (idCita: number): Promise<{cita: CitaMedica & {paciente: Paciente, caso: CasoClinico}} | null> => {
    const cita = mockCitas.find(c => c.idCita === idCita);
    if (!cita) return Promise.resolve(null);

    const paciente = mockPacientes.find(p => p.idPaciente === cita.idPaciente)!;
    const caso = mockCasos.find(c => c.idCaso === cita.idCaso)!;

    return Promise.resolve({ cita: {...cita, paciente, caso } });
}

export const guardarAtencion = (input: Omit<AtencionMedica, 'idAtencion' | 'estadoClinico' | 'requiereSeguimiento'>): Promise<AtencionMedica> => {
    const nuevaAtencion = { 
      ...input, 
      idAtencion: mockAtenciones.length + 1, 
      estadoClinico: 'BIEN' as const, 
      requiereSeguimiento: false
     };
    mockAtenciones.push(nuevaAtencion);
    const cita = mockCitas.find(c => c.idCita === input.idCita);
    if (cita) {
        cita.estadoCita = 'FINALIZADA';
    }
    return Promise.resolve(nuevaAtencion);
}


export const getExamenesMedicos = (filters?: { estado?: string, tipo?: string, pais?: Pais }): Promise<(ExamenMedico & {paciente: Paciente})[]> => {
    let examenes = [...mockExamenes];

    let examenesConPaciente = examenes.map(examen => {
        const paciente = mockPacientes.find(p => p.idPaciente === examen.idPaciente)!;
        return { ...examen, paciente };
    });
    
    return Promise.resolve(examenesConPaciente.sort((a,b) => new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime()));
}

export const getSeguimientos = (filters?: { estado?: string, tipo?: string, pais?: Pais }): Promise<(SeguimientoPaciente & {paciente: Paciente, caso: CasoClinico})[]> => {
    let seguimientosConDetalle = mockSeguimientos.map(seg => {
        const paciente = mockPacientes.find(p => p.idPaciente === seg.idPaciente)!;
        const caso = mockCasos.find(c => c.idCaso === seg.idCaso)!;
        return { ...seg, paciente, caso };
    });

    return Promise.resolve(seguimientosConDetalle.sort((a,b) => new Date(b.fechaProgramada).getTime() - new Date(a.fechaProgramada).getTime()));
}

export const registrarVacuna = (input: Omit<VacunaAplicada, 'idVacunaRegistro'>): Promise<VacunaAplicada> => {
    const nuevaVacuna: VacunaAplicada = {
        ...input,
        idVacunaRegistro: mockVacunas.length + 1,
    };
    mockVacunas.push(nuevaVacuna);
    return Promise.resolve(nuevaVacuna);
}


// --- Admin Services ---
type AtencionCompleta = AtencionMedica & { paciente: Paciente, medico: Medico, caso: CasoClinico, empleado: EmpleadoEmp2024 };

export const getAllAtenciones = (pais: Pais): Promise<AtencionCompleta[]> => {
    
    const atencionesDelPais = mockAtenciones.map(atencion => {
        const caso = mockCasos.find(c => c.idCaso === atencion.idCaso);
        if (!caso) return null;
        
        const paciente = mockPacientes.find(p => p.idPaciente === caso.idPaciente);
        if (!paciente) return null;

        const medico = mockMedicos.find(m => m.idMedico === atencion.idMedico);
        if (!medico) return null;

        return null; // Mock empleado no longer exists
    }).filter(Boolean) as AtencionCompleta[];

    return Promise.resolve(atencionesDelPais);
};

export const getDashboardAdmin = (pais: Pais): Promise<{
    kpis: {
        totalUsuarios: number,
        medicosActivos: number,
        chequeosEsteMes: number,
        citasEsteMes: number,
    },
    chequeosPorRuta: { name: string, value: number }[],
    citasPorEstado: { name: string, value: number, fill: string }[],
}> => {

    const kpis = {
        totalUsuarios: 10,
        medicosActivos: 2,
        chequeosEsteMes: 15,
        citasEsteMes: 8,
    }

    const chequeosPorRuta = [
        { name: 'Oficentro', value: 25 },
        { name: 'Teletrabajo', value: 40 },
        { name: 'Zona Franca', value: 15 },
    ]
    const citasPorEstado = [
        { name: 'Programada', value: 12, fill: 'hsl(var(--primary))' },
        { name: 'Confirmada', value: 8, fill: 'hsl(var(--secondary))' },
        { name: 'Finalizada', value: 30, fill: 'hsl(var(--accent))' },
        { name: 'Cancelada', value: 5, fill: 'hsl(var(--destructive))' },
    ]

    return Promise.resolve({ kpis, chequeosPorRuta, citasPorEstado });
}

export const getCasos = (): Promise<CasoClinico[]> => {
    const casosConDetalle = mockCasos.map(caso => {
        const atenciones = mockAtenciones.filter(a => a.idCaso === caso.idCaso);
        const paciente = mockPacientes.find(p => p.idPaciente === caso.idPaciente);
        return {...caso, atenciones, paciente };
    })
    return Promise.resolve(casosConDetalle);
}
