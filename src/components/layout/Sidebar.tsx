"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Users,
  Settings,
  ShieldCheck,
  FlaskConical,
  Repeat,
  BookUser,
  PanelLeft,
  CalendarPlus,
  BarChart3,
  CalendarDays,
  Stethoscope
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const NavItem = ({ href, icon: Icon, label, isCollapsed }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  const linkContent = (
      <Button
        variant="ghost"
        className={cn(
          "w-full h-12 justify-start text-white/80 hover:bg-white/10 hover:text-white",
          isCollapsed ? "px-3.5" : "px-4",
          isActive && "bg-white/20 text-white"
        )}
        aria-label={label}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="ml-3 font-medium">{label}</span>}
      </Button>
  );

  return (
    <li>
        {isCollapsed ? (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Link href={href}>{linkContent}</Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{label}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ) : (
             <Link href={href}>{linkContent}</Link>
        )}
    </li>
  );
};


const pacienteMenu = [
  { href: "/paciente/dashboard", icon: LayoutDashboard, label: "Panel" },
  { href: "/paciente/solicitar-cita", icon: CalendarPlus, label: "Solicitar Cita" },
  { href: "/paciente/mis-citas", icon: Calendar, label: "Mis Citas" },
  { href: "/paciente/historial-chequeos", icon: ClipboardList, label: "Historial Chequeos" },
];

const medicoMenu = [
  { href: "/medico/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/medico/agenda-citas", icon: CalendarPlus, label: "Gestión de Citas" },
  { href: "/medico/agenda-calendario", icon: CalendarDays, label: "Agenda (Calendario)" },
  { href: "/medico/pacientes-casos", icon: BookUser, label: "Pacientes y Casos" },
  { href: "/medico/examenes", icon: FlaskConical, label: "Exámenes" },
  { href: "/medico/seguimientos", icon: Repeat, label: "Seguimientos" },
  { href: "/medico/reportes", icon: BarChart3, label: "Reportes" },
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
        "bg-primary text-primary-foreground flex-col border-r border-primary-foreground/10 transition-all duration-300 ease-in-out",
        isMobile ? "fixed z-40 h-full" : "relative",
        isCollapsed ? "w-20" : "w-64",
        isMobile && isCollapsed ? 'hidden' : 'flex'
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-white/10", isCollapsed ? 'justify-center' : 'px-4')}>
         <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-white" />
            {!isCollapsed && (
            <h1 className="text-xl text-white">
                Claro <span className="font-bold">Mi Salud</span>
            </h1>
            )}
        </Link>
        {isMobile && (
            <Button variant="ghost" size="icon" className="ml-auto text-primary-foreground" onClick={toggleSidebar}>
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
