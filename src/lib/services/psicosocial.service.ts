import api from '../api';

export interface CreateEvaluacionDto {
    idPaciente: number;
    nivelEstres?: string;
    sintomas?: string[];
    narrativa: string;
    idMedico?: number;
}

export interface RegistroPsicosocial {
    id_registro: number;
    fecha_registro: string;
    nivel_estres: string;
    sintomas_referidos: any;
    narrativa_paciente: string;
    resumen_ia?: string;
    analisis_sentimiento_ia?: string;
    riesgo_suicida?: boolean;
    derivar_a_psicologia?: boolean;
}

export const PsicosocialService = {
    registrarEvaluacion: async (data: CreateEvaluacionDto): Promise<RegistroPsicosocial> => {
        const response = await api.post<RegistroPsicosocial>('/psicosocial', data);
        return response.data;
    },

    getHistorial: async (idPaciente: number): Promise<RegistroPsicosocial[]> => {
        const response = await api.get<RegistroPsicosocial[]>(`/psicosocial/paciente/${idPaciente}`);
        return response.data;
    }
};
