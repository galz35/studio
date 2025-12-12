import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        // Si la ruta requiere rol PACIENTE, permitir acceso a ADMIN y MEDICO también
        if (requiredRoles.includes('PACIENTE')) {
            const allowedRolesForPaciente = ['ADMIN', 'MEDICO', 'PACIENTE'];
            return allowedRolesForPaciente.some(role => user.rol?.includes(role));
        }

        return requiredRoles.some((role) => user.rol?.includes(role));
    }
}
