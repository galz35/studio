// Este archivo simula una API real. En un entorno de producción,
// estas funciones harían peticiones fetch a tu backend (NestJS).

import {
  atenciones,
  casosClinicos,
  chequeos,
  citas,
  examenes,
  medicos,
  pacientes,
  seguimientos,
  seguimientosGenerados,
  usuarios,
  vacunasAplicadas,
  registrosPsicosociales,
  empleados,
} from '@/lib/mock';
import type { 
    AtencionMedica, 
    CasoClinico, 
    ChequeoBienestar, 
    CitaMedica, 
    ExamenMedico,
    Medico,
    Paciente,
    SeguimientoPaciente,
    SeguimientoGenerado,
    UsuarioAplicacion,
    VacunaAplicada,
    RegistroPsicosocial,
    EmpleadoEmp2024,
    TriajeIA
} from '@/lib/types/domain';
import { analizarTriajeMedico } from '@/ai/flows/analisis-triaje-medico';

// --- Utils ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
let nextId = 100;

// --- API Functions ---

// CASOS CLINICOS
export const getCasosClinicos = async (filters: { pais?: string; estado?: string | string[] } = {}): Promise<(CasoClinico & { paciente: Paciente })[]> => {
  await delay(500);
  
  let filteredCasos = casosClinicos;

  if (filters.pais) {
    // This is tricky with mock data as pacientes have country, but casos don't directly
    const pacientesDelPais = pacientes.filter(p => p.pais === filters.pais).map(p => p.id);
    filteredCasos = filteredCasos.filter(c => pacientesDelPais.includes(c.idPaciente));
  }

  if (filters.estado) {
    const estados = Array.isArray(filters.estado) ? filters.estado : [filters.estado];
    filteredCasos = filteredCasos.filter(c => estados.includes(c.estadoCaso));
  }

  // Populate patient data
  return filteredCasos.map(caso => ({
    ...caso,
    paciente: pacientes.find(p => p.id === caso.idPaciente)!
  }));
};

export const getCasoById = async (id: string): Promise<(CasoClinico & { paciente: Paciente; atenciones: AtencionMedica[]; examenes: ExamenMedico[]; seguimientos: SeguimientoPaciente[] }) | null> => {
    await delay(500);
    const caso = casosClinicos.find(c => c.id === id);
    if (!caso) return null;

    return {
        ...caso,
        paciente: pacientes.find(p => p.id === caso.idPaciente)!,
        atenciones: atenciones.filter(a => a.idCaso === id),
        examenes: examenes.filter(e => e.idCaso === id),
        seguimientos: seguimientos.filter(s => s.idCaso === id)
    };
};


export const crearCasoClinico = async (data: Partial<CasoClinico>): Promise<CasoClinico> => {
  await delay(300);
  const newCaso: CasoClinico = {
    id: `caso-${nextId++}`,
    idCaso: nextId,
    ...data,
  } as CasoClinico;
  
  // Async call to IA without blocking the main thread
  analizarTriajeMedico({ sintomas: newCaso.motivoConsulta })
    .then(analisis => {
      // Find the created case and update it with the IA analysis
      const index = casosClinicos.findIndex(c => c.id === newCaso.id);
      if (index !== -1) {
        casosClinicos[index].triajeIA = analisis;
        console.log("Análisis de IA completado y añadido al caso:", newCaso.id);
      }
    })
    .catch(error => {
      console.error("Error en el análisis de IA:", error);
      // Optionally, update the case to show an error
      const index = casosClinicos.findIndex(c => c.id === newCaso.id);
      if (index !== -1) {
        casosClinicos[index].triajeIA = null; // Mark as failed or add error info
      }
    });

  casosClinicos.push(newCaso);
  return newCaso;
};

export const updateCaso = async(id: string, data: Partial<CasoClinico>): Promise<CasoClinico> => {
    await delay(200);
    const index = casosClinicos.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Caso no encontrado");
    casosClinicos[index] = { ...casosClinicos[index], ...data };
    return casosClinicos[index];
}

// CITAS
export const agendarCita = async (data: { idCaso: string; idPaciente: string; idMedico: string; fechaCita: string; horaCita: string; }): Promise<CitaMedica> => {
    await delay(400);

    const caso = casosClinicos.find(c => c.id === data.idCaso);
    if (!caso) throw new Error("Caso no encontrado");

    const newCita: CitaMedica = {
        id: `cita-${nextId++}`,
        idCita: nextId,
        idCaso: data.idCaso,
        idPaciente: data.idPaciente,
        idMedico: data.idMedico,
        fechaCita: data.fechaCita,
        horaCita: data.horaCita,
        canalOrigen: "AGENDADA_POR_MEDICO",
        estadoCita: "PROGRAMADA",
        motivoResumen: caso.motivoConsulta,
        nivelSemaforoPaciente: caso.nivelSemaforo,
        pais: pacientes.find(p => p.id === data.idPaciente)!.pais
    };
    citas.push(newCita);

    // Update caso
    caso.estadoCaso = "Agendado";
    caso.idCita = newCita.id;

    return newCita;
}


// PACIENTES
export const getPacientes = async (filters: { pais?: string } = {}): Promise<Paciente[]> => {
    await delay(300);
    if (filters.pais) {
        return pacientes.filter(p => p.pais === filters.pais);
    }
    return pacientes;
}

export const getChequeosPorPaciente = async (idPaciente: string): Promise<ChequeoBienestar[]> => {
    await delay(400);
    return chequeos.filter(c => c.idPaciente === idPaciente).sort((a,b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime());
};

export const getCitasPorPaciente = async (idPaciente: string): Promise<(CitaMedica & {medico?: Medico})[]> => {
    await delay(400);
    const citasPaciente = citas.filter(c => c.idPaciente === idPaciente);
    return citasPaciente.map(cita => ({
        ...cita,
        medico: medicos.find(m => m.id === cita.idMedico)
    }));
}

export const getExamenesPorPaciente = async (idPaciente: string): Promise<ExamenMedico[]> => {
    await delay(400);
    return examenes.filter(e => e.idPaciente === idPaciente);
}

export const getVacunasPorPaciente = async (idPaciente: string): Promise<(VacunaAplicada & {medico?: Medico})[]> => {
    await delay(400);
    const vacunasPaciente = vacunasAplicadas.filter(v => v.idPaciente === idPaciente);
    return vacunasPaciente.map(v => ({
        ...v,
        medico: medicos.find(m => m.id === v.idMedico)
    }));
}

// MEDICOS
export const getMedicos = async (filters: { pais?: string } = {}): Promise<Medico[]> => {
  await delay(300);

  // External doctors are available to all countries
  const medicosExternos = medicos.filter(m => m.tipoMedico === 'EXTERNO');
  
  if (filters.pais) {
    const empleadosDelPais = (await getEmpleados()).filter(e => e.pais === filters.pais).map(e => e.carnet);
    const medicosInternosDelPais = medicos.filter(m => m.tipoMedico === 'INTERNO' && m.carnet && empleadosDelPais.includes(m.carnet));
    return [...medicosInternosDelPais, ...medicosExternos];
  }

  return medicos;
};

export const crearMedico = async (data: Omit<Medico, 'id' | 'idMedico'>): Promise<Medico> => {
    await delay(400);
    const newMedico: Medico = {
        id: `medico-${nextId++}`,
        idMedico: nextId,
        ...data
    };
    medicos.push(newMedico);
    return newMedico;
}

// EMPLEADOS
export const getEmpleados = async (): Promise<EmpleadoEmp2024[]> => {
    await delay(100);
    return empleados;
}


// USUARIOS
export const getUsuarios = async (): Promise<UsuarioAplicacion[]> => {
    await delay(300);
    return usuarios;
}

export const crearUsuario = async (data: Omit<UsuarioAplicacion, 'id' | 'idUsuario'>): Promise<UsuarioAplicacion> => {
    await delay(400);

    const newUsuario: UsuarioAplicacion = {
        id: `user-${nextId++}`,
        idUsuario: nextId,
        ...data,
    };
    
    // Si es paciente o medico, crear la entidad correspondiente
    if(newUsuario.rol === 'PACIENTE' && !newUsuario.idPaciente) {
        const newPaciente: Paciente = {
            id: `paciente-${nextId++}`,
            idPaciente: nextId,
            carnet: newUsuario.carnet,
            nombreCompleto: newUsuario.nombreCompleto,
            correo: newUsuario.correo,
            estadoPaciente: 'A',
            nivelSemaforo: 'V',
            pais: newUsuario.pais,
        };
        pacientes.push(newPaciente);
        newUsuario.idPaciente = newPaciente.id;
    }
    
    usuarios.push(newUsuario);
    return newUsuario;
};

export const updateUsuario = async(id: string, data: Partial<UsuarioAplicacion>): Promise<UsuarioAplicacion> => {
    await delay(200);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) throw new Error("Usuario no encontrado");
    usuarios[index] = { ...usuarios[index], ...data };
    return usuarios[index];
}


// CHEQUEOS
export const crearChequeo = async (data: Partial<ChequeoBienestar>): Promise<ChequeoBienestar> => {
    await delay(300);
    const newChequeo: ChequeoBienestar = {
        id: `chequeo-${nextId++}`,
        idChequeo: nextId,
        fechaRegistro: new Date().toISOString(),
        ...data,
    } as ChequeoBienestar;
    chequeos.push(newChequeo);
    
    // Si el chequeo es para una consulta, crear un caso clínico
    if (data.estadoChequeo === 'Requiere atención') {
        await crearCasoClinico({
            idPaciente: data.idPaciente!,
            fechaCreacion: new Date().toISOString(),
            estadoCaso: 'Abierto',
            nivelSemaforo: data.nivelSemaforo!,
            motivoConsulta: data.comentarioGeneral || 'Solicitud desde chequeo de bienestar',
        });
    }

    return newChequeo;
};


// ATENCIONES
export const getAtencionMedicaData = async (idCita: string) => {
    await delay(500);
    const cita = citas.find(c => c.id === idCita);
    if (!cita) return null;
    const paciente = pacientes.find(p => p.id === cita.idPaciente);
    const caso = casosClinicos.find(c => c.id === cita.idCaso);
    const empleado = empleados.find(e => e.carnet === paciente?.carnet);
    
    if (!paciente || !caso || !empleado) return null;

    return {
        cita,
        paciente,
        empleado,
        caso,
    };
}

export const guardarAtencion = async (data: Partial<AtencionMedica> & { vacunas?: any[], psico?: any, seguimientos?: any[] }) => {
    await delay(600);
    
    const { vacunas, psico, seguimientos: nuevosSeguimientos, ...atencionData } = data;
    
    const newAtencion: AtencionMedica = {
        id: `atencion-${nextId++}`,
        idAtencion: nextId,
        fechaAtencion: new Date().toISOString(),
        ...atencionData,
    } as AtencionMedica;
    atenciones.push(newAtencion);

    // Update cita
    const citaIndex = citas.findIndex(c => c.id === newAtencion.idCita);
    if(citaIndex !== -1) citas[citaIndex].estadoCita = 'FINALIZADA';
    
    // Update caso
    const casoIndex = casosClinicos.findIndex(c => c.id === newAtencion.idCaso);
    if(casoIndex !== -1) casosClinicos[casoIndex].estadoCaso = 'Cerrado';
    
    // Add vacunas
    if (vacunas && vacunas.length > 0) {
        vacunas.forEach(v => {
            vacunasAplicadas.push({
                id: `vac-${nextId++}`,
                idVacunaRegistro: nextId,
                idAtencion: newAtencion.id,
                ...v,
            });
        });
    }

    // Add psicosocial
    if (psico) {
        registrosPsicosociales.push({
            id: `psico-${nextId++}`,
            idRegistroPsico: nextId,
            idAtencion: newAtencion.id!,
            ...psico,
        });
    }

    // Add seguimientos
    if (nuevosSeguimientos && nuevosSeguimientos.length > 0) {
        nuevosSeguimientos.forEach(s => {
            seguimientos.push({
                id: `seg-${nextId++}`,
                idSeguimiento: nextId,
                idAtencion: newAtencion.id,
                ...s,
            });
        });
    }
    
    return newAtencion;
}

// SEGUIMIENTOS
export const getSeguimientos = async (filters: { pais?: string }): Promise<(SeguimientoPaciente & { paciente: Paciente, caso: CasoClinico })[]> => {
    await delay(300);
    const seguimientosConDetalle = seguimientos.map(s => ({
        ...s,
        paciente: pacientes.find(p => p.id === s.idPaciente)!,
        caso: casosClinicos.find(c => c.id === s.idCaso)!
    }));

    if (filters.pais) {
        return seguimientosConDetalle.filter(s => s.paciente.pais === filters.pais);
    }

    return seguimientosConDetalle;
}


export const getCitasPorMedico = async (idMedico: string, filters: { pais?: string } = {}): Promise<(CitaMedica & {paciente: Paciente})[]> => {
    await delay(400);
    const citasMedico = citas
        .filter(c => c.idMedico === idMedico)
        .map(c => ({
            ...c,
            paciente: pacientes.find(p => p.id === c.idPaciente)!
        }));
        
    if (filters.pais) {
        return citasMedico.filter(c => c.paciente.pais === filters.pais);
    }
    return citasMedico;
}


// EXAMENES
export const getExamenes = async (filters: { pais?: string }): Promise<(ExamenMedico & { paciente: Paciente })[]> => {
    await delay(300);
    const examenesConPaciente = examenes.map(e => ({
        ...e,
        paciente: pacientes.find(p => p.id === e.idPaciente)!
    }));
    if (filters.pais) {
        return examenesConPaciente.filter(e => e.paciente.pais === filters.pais);
    }
    return examenesConPaciente;
}

export const getDashboardMedico = async (idMedico: string, pais: string) => {
    await delay(700);

    const today = new Date().toISOString().split('T')[0];

    const citasDelDia = citas.filter(c => c.idMedico === idMedico && c.fechaCita === today && c.estadoCita === 'PROGRAMADA');
    
    const pacientesEnRojo = pacientes.filter(p => p.pais === pais && p.nivelSemaforo === 'R').length;
    
    const medico = medicos.find(m => m.id === idMedico);
    const seguimientosPendientes = seguimientos.filter(s => s.usuarioResponsable === medico?.nombreCompleto && s.estadoSeguimiento === 'PENDIENTE').length;
    
    const examenesSinResultado = examenes.filter(e => {
        const paciente = pacientes.find(p => p.id === e.idPaciente);
        return paciente && paciente.pais === pais && e.estadoExamen === 'PENDIENTE';
    }).length;

    const populatedCitas = citasDelDia.map(c => ({
        ...c,
        paciente: pacientes.find(p => p.id === c.idPaciente) || null,
        caso: casosClinicos.find(cs => cs.id === c.idCaso) || null,
    }));

    const data = {
        kpis: {
            citasHoy: citasDelDia.length,
            pacientesEnRojo,
            seguimientosPendientes,
            examenesSinResultado,
        },
        citasDelDia: populatedCitas,
        alertas: seguimientosPendientes > 0 ? [{ message: `Tienes ${seguimientosPendientes} seguimientos vencidos o por vencer.`, type: 'warning' as const }] : [],
    };
    return data;
}

// DASHBOARD ADMIN
export const getDashboardAdmin = async (filters: { pais: string, gerencia: string, dateRange: {from: Date, to: Date} }) => {
     await delay(800);
     
     // This would be a complex query in a real DB. We'll simplify.
     const { pais, gerencia, dateRange } = filters;
     
     const atencionesPeriodo = atenciones.filter(a => {
         const fecha = new Date(a.fechaAtencion);
         return fecha >= dateRange.from && fecha <= dateRange.to;
     });

     const atencionesConDetalles = atencionesPeriodo.map(a => {
         const cita = citas.find(c => c.id === a.idCita);
         if (!cita) return null;
         const paciente = pacientes.find(p => p.id === cita.idPaciente);
         if (!paciente || paciente.pais !== pais) return null;
         if (gerencia !== 'all' && paciente.gerencia !== gerencia) return null;
         
         const caso = casosClinicos.find(cs => cs.id === a.idCaso);
         return { ...a, paciente, caso };
     }).filter(Boolean);
     
     // KPIs
     const totalAtenciones = atencionesConDetalles.length;
     const casosCerrados = atencionesConDetalles.map(a => a?.idCaso).filter(Boolean);
     
     // ... more KPIs
     
     return {
         kpis: {
             atencionesRealizadas: totalAtenciones,
             casosCerrados: new Set(casosCerrados).size,
             // ...
         },
         // ... chart data
     }
}


// PSICOSOCIAL
export const getRegistrosPsicosociales = async (filters: { pais: string }) => {
    await delay(300);
    return registrosPsicosociales.filter(r => {
        const p = pacientes.find(p => p.id === r.idPaciente);
        return p?.pais === filters.pais;
    });
};

export const crearRegistroPsicosocial = async (data: Omit<RegistroPsicosocial, 'id' | 'idRegistroPsico'>): Promise<RegistroPsicosocial> => {
    await delay(400);
    const newRegistro: RegistroPsicosocial = {
        id: `psico-${nextId++}`,
        idRegistroPsico: nextId,
        ...data,
    };
    registrosPsicosociales.push(newRegistro);
    return newRegistro;
};
