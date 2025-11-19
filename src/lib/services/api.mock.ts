// All functions must return Promise.resolve(...) to simulate async calls.

import { 
  pacientes as mockPacientes,
  chequeos as mockChequeos,
  citas as mockCitas,
  casosClinicos as mockCasos,
  atenciones as mockAtenciones,
  examenes as mockExamenes,
  seguimientos as mockSeguimientos,
  medicos as mockMedicos,
  usuarios as mockUsuarios,
  empleadosEmp2024 as mockEmpleados
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
  Pais
} from '@/lib/types/domain';

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

export const crearChequeo = (input: Omit<ChequeoBienestar, 'idChequeo' | 'fechaRegistro'>): Promise<ChequeoBienestar> => {
  const nuevoChequeo: ChequeoBienestar = {
    ...input,
    idChequeo: mockChequeos.length + 1,
    fechaRegistro: new Date().toISOString(),
  };
  mockChequeos.unshift(nuevoChequeo); // Add to the beginning of the array
  return Promise.resolve(nuevoChequeo);
};

export const getDashboardPaciente = (idPaciente: number): Promise<{
  kpis: {
    estadoActual: 'V' | 'A' | 'R';
    ultimoChequeo: string;
    proximaCita: string | null;
    seguimientosActivos: number;
  },
  ultimoChequeoData: ChequeoBienestar | null;
  timeline: { title: string; date: string }[];
}> => {
    const chequeos = mockChequeos.filter(c => c.idPaciente === idPaciente).sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime());
    const citas = mockCitas.filter(c => c.idPaciente === idPaciente && new Date(c.fechaCita) >= new Date()).sort((a, b) => new Date(a.fechaCita).getTime() - new Date(b.fechaCita).getTime());
    const seguimientos = mockSeguimientos.filter(s => s.idPaciente === idPaciente && s.estadoSeguimiento === 'PENDIENTE');

    const ultimoChequeoData = chequeos[0] || null;

    const kpis = {
        estadoActual: ultimoChequeoData?.nivelSemaforo || 'V',
        ultimoChequeo: ultimoChequeoData ? new Date(ultimoChequeoData.fechaRegistro).toLocaleDateString('es-ES') : 'N/A',
        proximaCita: citas[0] ? `${new Date(citas[0].fechaCita).toLocaleDateString('es-ES')} ${citas[0].horaCita}` : null,
        seguimientosActivos: seguimientos.length,
    };
    
    // Fake timeline
    const timeline = [
        { title: "Chequeo completado", date: "2024-07-29" },
        { title: "Cita realizada", date: "2024-07-28" },
        { title: "Seguimiento resuelto", date: "2024-06-20" },
    ]

    return Promise.resolve({ kpis, ultimoChequeoData, timeline });
};


// --- Medico Services ---

export const getCitasPorMedico = (idMedico: number, filters?: { dateRange?: [Date, Date], estado?: string, semaforo?: string, pais?: Pais }): Promise<(CitaMedica & {paciente: Paciente})[]> => {
    let citas = mockCitas.filter(c => c.idMedico === idMedico);
    
    if (filters?.estado) {
        citas = citas.filter(c => c.estadoCita === filters.estado);
    }

    const citasConPaciente = citas.map(cita => {
        const paciente = mockPacientes.find(p => p.idPaciente === cita.idPaciente)!;
        return { ...cita, paciente };
    });

    // filter by semaforo and pais on patient data
    let filteredCitas = citasConPaciente;

    if (filters?.semaforo) {
        filteredCitas = filteredCitas.filter(c => c.paciente.nivelSemaforo === filters.semaforo);
    }
    
    // Pais filter from Empleado data
    if (filters?.pais) {
      const empleadosDelPais = mockEmpleados.filter(e => e.pais === filters.pais).map(e => e.carnet);
      filteredCitas = filteredCitas.filter(c => empleadosDelPais.includes(c.paciente.carnet));
    }

    return Promise.resolve(filteredCitas.sort((a, b) => new Date(a.fechaCita).getTime() - new Date(b.fechaCita).getTime()));
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
    const empleadosDelPais = mockEmpleados.filter(e => e.pais === pais).map(e => e.carnet);
    const pacientesDelPais = mockPacientes.filter(p => empleadosDelPais.includes(p.carnet));
    const pacientesDelPaisIds = pacientesDelPais.map(p => p.idPaciente);

    const today = new Date().toISOString().split('T')[0];
    const citasHoy = mockCitas.filter(c => c.idMedico === idMedico && c.fechaCita === today && pacientesDelPaisIds.includes(c.idPaciente));
    
    const pacientesRojos = pacientesDelPais.filter(p => p.nivelSemaforo === 'R');
    const seguimientosPendientes = mockSeguimientos.filter(s => s.usuarioResponsable.includes(mockMedicos.find(m=>m.idMedico === idMedico)?.nombreCompleto || 'undefined') && s.estadoSeguimiento === 'PENDIENTE' && pacientesDelPaisIds.includes(s.idPaciente));
    const examenesPendientes = mockExamenes.filter(e => e.estadoExamen === 'PENDIENTE' && pacientesDelPaisIds.includes(e.idPaciente));

    const kpis = {
      citasHoy: citasHoy.length,
      pacientesEnRojo: pacientesRojos.length,
      seguimientosPendientes: seguimientosPendientes.length,
      examenesSinResultado: examenesPendientes.length,
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

export const guardarAtencion = (input: Omit<AtencionMedica, 'idAtencion'>): Promise<AtencionMedica> => {
    const nuevaAtencion = { ...input, idAtencion: mockAtenciones.length + 1 };
    mockAtenciones.push(nuevaAtencion);
    const cita = mockCitas.find(c => c.idCita === input.idCita);
    if (cita) {
        cita.estadoCita = 'FINALIZADA';
    }
    return Promise.resolve(nuevaAtencion);
}


export const getExamenesMedicos = (filters?: { estado?: string, tipo?: string, pais?: Pais }): Promise<(ExamenMedico & {paciente: Paciente})[]> => {
    let examenes = [...mockExamenes];
    
    if (filters?.estado) {
        examenes = examenes.filter(e => e.estadoExamen === filters.estado);
    }
    if (filters?.tipo) {
        examenes = examenes.filter(e => e.tipoExamen === filters.tipo);
    }

    let examenesConPaciente = examenes.map(examen => {
        const paciente = mockPacientes.find(p => p.idPaciente === examen.idPaciente)!;
        return { ...examen, paciente };
    });
    
    if (filters?.pais) {
      const empleadosDelPais = mockEmpleados.filter(e => e.pais === filters.pais).map(e => e.carnet);
      examenesConPaciente = examenesConPaciente.filter(e => empleadosDelPais.includes(e.paciente.carnet));
    }
    
    return Promise.resolve(examenesConPaciente.sort((a,b) => new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime()));
}

export const getSeguimientos = (filters?: { estado?: string, tipo?: string, pais?: Pais }): Promise<(SeguimientoPaciente & {paciente: Paciente, caso: CasoClinico})[]> => {
    let seguimientos = [...mockSeguimientos];
    // filter logic here

    let seguimientosConDetalle = seguimientos.map(seg => {
        const paciente = mockPacientes.find(p => p.idPaciente === seg.idPaciente)!;
        const caso = mockCasos.find(c => c.idCaso === seg.idCaso)!;
        return { ...seg, paciente, caso };
    });

    if (filters?.pais) {
        const empleadosDelPais = mockEmpleados.filter(e => e.pais === filters.pais).map(e => e.carnet);
        seguimientosConDetalle = seguimientosConDetalle.filter(s => empleadosDelPais.includes(s.paciente.carnet));
    }

    return Promise.resolve(seguimientosConDetalle.sort((a,b) => new Date(b.fechaProgramada).getTime() - new Date(a.fechaProgramada).getTime()));
}


// --- Admin Services ---
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
    const empleadosDelPais = mockEmpleados.filter(e => e.pais === pais).map(e => e.carnet);
    const usuariosDelPais = mockUsuarios.filter(u => empleadosDelPais.includes(u.carnet));
    const pacientesDelPaisIds = mockPacientes.filter(p => empleadosDelPais.includes(p.carnet)).map(p => p.idPaciente);
    const medicosDelPaisIds = mockMedicos.filter(m => m.carnet && empleadosDelPais.includes(m.carnet)).map(m => m.idMedico);

    const kpis = {
        totalUsuarios: usuariosDelPais.length,
        medicosActivos: mockMedicos.filter(m => m.estadoMedico === 'A' && m.carnet && empleadosDelPais.includes(m.carnet)).length,
        chequeosEsteMes: mockChequeos.filter(c => new Date(c.fechaRegistro).getMonth() === new Date().getMonth() && pacientesDelPaisIds.includes(c.idPaciente)).length,
        citasEsteMes: mockCitas.filter(c => new Date(c.fechaCita).getMonth() === new Date().getMonth() && (pacientesDelPaisIds.includes(c.idPaciente) || (c.idMedico && medicosDelPaisIds.includes(c.idMedico)))).length,
    }

    const chequeosPorRuta = [
        { name: 'Oficentro', value: 25 },
        { name: 'Teletrabajo', value: 40 },
        { name: 'Zona Franca', value: 15 },
    ]
    const citasPorEstado = [
        { name: 'Programada', value: 12, fill: 'var(--color-yellow)' },
        { name: 'Confirmada', value: 8, fill: 'var(--color-blue)' },
        { name: 'Finalizada', value: 30, fill: 'var(--color-green)' },
        { name: 'Cancelada', value: 5, fill: 'var(--color-red)' },
    ]

    return Promise.resolve({ kpis, chequeosPorRuta, citasPorEstado });
}

export const getUsuarios = (filters?: { rol?: Rol, estado?: 'A' | 'I', pais?: Pais }): Promise<UsuarioAplicacion[]> => {
    let usuarios = [...mockUsuarios];

    if (filters?.rol) {
        usuarios = usuarios.filter(u => u.rol === filters.rol);
    }
    if (filters?.estado) {
        usuarios = usuarios.filter(u => u.estado === filters.estado);
    }
    if (filters?.pais) {
        const empleadosDelPais = mockEmpleados.filter(e => e.pais === filters.pais).map(e => e.carnet);
        usuarios = usuarios.filter(u => empleadosDelPais.includes(u.carnet));
    }

    return Promise.resolve(usuarios);
}

export const getMedicos = (filters?: { pais?: Pais }): Promise<Medico[]> => {
    let medicos = [...mockMedicos];
    if (filters?.pais) {
      const empleadosDelPais = mockEmpleados.filter(e => e.pais === filters.pais).map(e => e.carnet);
      medicos = medicos.filter(m => m.tipoMedico === 'EXTERNO' || (m.carnet && empleadosDelPais.includes(m.carnet)));
    }
    return Promise.resolve(medicos);
};

export const getEmpleados = (): Promise<EmpleadoEmp2024[]> => {
    return Promise.resolve(mockEmpleados);
}
