"use client";

import {
  PanelLeft,
  User,
  LogOut,
  ChevronDown,
  Globe,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import type { Pais, Rol } from "@/lib/types/domain";

export function Topbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { usuarioActual, logout, switchRole, pais, setPais } = useAuth();

  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <PanelLeft className="h-6 w-6" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="flex-1">
        {/* Breadcrumb can go here */}
      </div>
      <div className="flex items-center gap-4">
        {/* Country Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Globe className="h-4 w-4" />
              <span>{pais}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Seleccionar País</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={pais} onValueChange={(p) => setPais(p as Pais)}>
                <DropdownMenuRadioItem value="NI">Nicaragua</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="CR">Costa Rica</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="HN">Honduras</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Building className="h-4 w-4" />
              <span>Rol: {usuarioActual?.rol}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Cambiar Rol</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={usuarioActual?.rol} onValueChange={(r) => switchRole(r as Rol)}>
                <DropdownMenuRadioItem value="PACIENTE">Paciente</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="MEDICO">Médico</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ADMIN">Administrador</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>


        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {getInitials(usuarioActual?.nombreCompleto)}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="font-medium">{usuarioActual?.nombreCompleto}</div>
              <div className="text-xs text-muted-foreground">{usuarioActual?.carnet}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
