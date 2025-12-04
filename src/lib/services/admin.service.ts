import api from '../api';
import { UsuarioAplicacion, Medico, EmpleadoEmp2024 } from '../types/domain';

export interface AdminDashboardData {
    totalUsuarios: number;
    medicosActivos: number;
    pacientesActivos: number;
    ultimosUsuarios: UsuarioAplicacion[];
}

export const AdminService = {
    getDashboard: async (): Promise<AdminDashboardData> => {
        const response = await api.get<AdminDashboardData>('/admin/dashboard');
        return response.data;
    },

    getUsuarios: async (): Promise<UsuarioAplicacion[]> => {
        const response = await api.get<UsuarioAplicacion[]>('/admin/usuarios');
        return response.data;
    },

    crearUsuario: async (usuario: Omit<UsuarioAplicacion, 'id' | 'idUsuario'>): Promise<UsuarioAplicacion> => {
        const response = await api.post<UsuarioAplicacion>('/admin/usuarios', usuario);
        return response.data;
    },

    updateUsuario: async (id: string, usuario: Partial<UsuarioAplicacion>): Promise<UsuarioAplicacion> => {
        const response = await api.patch<UsuarioAplicacion>(`/admin/usuarios/${id}`, usuario);
        return response.data;
    },

    getMedicos: async (): Promise<Medico[]> => {
        const response = await api.get<Medico[]>('/admin/medicos');
        return response.data;
    },

    crearMedico: async (medico: Omit<Medico, 'idMedico' | 'id'>): Promise<Medico> => {
        const response = await api.post<Medico>('/admin/medicos', medico);
        return response.data;
    },

    getEmpleados: async (params?: { carnet?: string }): Promise<EmpleadoEmp2024[]> => {
        const response = await api.get<EmpleadoEmp2024[]>('/admin/empleados', { params });
        return response.data;
    },

    getReportesAtenciones: async (filters?: any): Promise<any[]> => {
        const response = await api.get<any[]>('/admin/reportes/atenciones', { params: filters });
        return response.data;
    }
};
