"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Stethoscope,
  Users,
  Settings,
  ShieldCheck,
  FlaskConical,
  Repeat,
  BookUser,
  PanelLeft,
  CalendarPlus,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const NavItem = ({ href, icon: Icon, label, isCollapsed }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <li>
      <Link href={href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn("w-full justify-start h-10", isCollapsed ? "px-2" : "px-3")}
          aria-label={label}
        >
          <Icon className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">{label}</span>}
        </Button>
      </Link>
    </li>
  );
};


const pacienteMenu = [
  { href: "/paciente/dashboard", icon: LayoutDashboard, label: "Panel" },
  { href: "/paciente/chequeo-diario", icon: ShieldCheck, label: "Chequeo Diario" },
  { href: "/paciente/solicitar-cita", icon: CalendarPlus, label: "Solicitar Cita" },
  { href: "/paciente/mis-citas", icon: Calendar, label: "Mis Citas" },
  { href: "/paciente/historial-chequeos", icon: ClipboardList, label: "Historial Chequeos" },
];

const medicoMenu = [
  { href: "/medico/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/medico/agenda-citas", icon: Calendar, label: "Agenda de Citas" },
  { href: "/medico/pacientes-casos", icon: BookUser, label: "Pacientes y Casos" },
  { href: "/medico/examenes", icon: FlaskConical, label: "Exámenes" },
  { href: "/medico/seguimientos", icon: Repeat, label: "Seguimientos" },
];

const adminMenu = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/gestion-usuarios", icon: Users, label: "Usuarios" },
  { href: "/admin/gestion-medicos", icon: Stethoscope, label: "Médicos" },
  { href: "/admin/configuracion", icon: Settings, label: "Configuración" },
];


export function Sidebar({ isCollapsed, toggleSidebar }: { isCollapsed: boolean, toggleSidebar: () => void }) {
  const { usuarioActual } = useAuth();
  const isMobile = useIsMobile();

  const getMenu = () => {
    switch (usuarioActual?.rol) {
      case "PACIENTE":
        return pacienteMenu;
      case "MEDICO":
        return medicoMenu;
      case "ADMIN":
        return adminMenu;
      default:
        return [];
    }
  };

  const menuItems = getMenu();

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isMobile ? "fixed z-40 h-full" : "relative",
        isCollapsed ? "w-16" : "w-64",
        isMobile && !isCollapsed ? 'hidden' : 'flex'
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-sidebar-border", isCollapsed ? 'justify-center' : 'px-4')}>
         <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-primary" />
            {!isCollapsed && (
            <h1 className="text-xl font-bold text-sidebar-foreground">
                Médica <span className="text-primary">Corp</span>
            </h1>
            )}
        </Link>
        {isMobile && (
            <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
                <PanelLeft />
            </Button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <NavItem key={item.href} {...item} isCollapsed={isCollapsed} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
