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
  FlaskConical,
  Repeat,
  BookUser,
  CalendarPlus,
  BarChart3,
  CalendarDays,
  Stethoscope,
  X,
  BookOpen,
  Syringe,
  Users2,
} from "lucide-react";

import { useUserProfile } from "@/hooks/use-user-profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

  const linkContent = (
      <div
        className={cn(
          "flex items-center w-full h-12 justify-start text-white/80 rounded-md hover:bg-white/10 hover:text-white transition-colors",
          isCollapsed ? "px-3.5" : "px-4",
          isActive && "bg-white/20 text-white"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="ml-3 font-medium">{label}</span>}
      </div>
  );

  return (
    <li>
        {isCollapsed ? (
            <TooltipProvider delayDuration={0}>
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
  { href: "/paciente/historial-chequeos", icon: ClipboardList, label: "Mis Chequeos" },
  { href: "/paciente/mis-examenes", icon: FlaskConical, label: "Mis Exámenes" },
  { href: "/paciente/mis-vacunas", icon: Syringe, label: "Mis Vacunas" },
];

const medicoMenu = [
  { href: "/medico/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/medico/agenda-citas", icon: CalendarPlus, label: "Gestión de Citas" },
  { href: "/medico/agenda-calendario", icon: CalendarDays, label: "Agenda (Calendario)" },
  { href: "/medico/pacientes-casos", icon: BookUser, label: "Pacientes y Casos" },
  { href: "/medico/examenes", icon: FlaskConical, label: "Exámenes" },
  { href: "/medico/seguimientos", icon: Repeat, label: "Seguimientos" },
  { href: "/medico/registro-vacunas", icon: Syringe, label: "Registro de Vacunas" },
  { href: "/medico/reportes", icon: BarChart3, label: "Reportes" },
];

const adminMenu = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/gestion-usuarios", icon: Users, label: "Usuarios" },
  { href: "/admin/gestion-empleados", icon: Users2, label: "Empleados" },
  { href: "/admin/gestion-medicos", icon: Stethoscope, label: "Médicos" },
  { href: "/admin/reportes", icon: BarChart3, label: "Reportes" },
  { href: "/admin/configuracion", icon: Settings, label: "Configuración" },
];

const commonMenu = [
    { href: "/tutorial", icon: BookOpen, label: "Ayuda / Tutorial" },
];


export function Sidebar({ isCollapsed, toggleSidebar }: { isCollapsed: boolean, toggleSidebar: () => void }) {
  const { userProfile } = useUserProfile();
  const isMobile = useIsMobile();

  const getMenu = () => {
    if (!userProfile) return [];
    switch (userProfile?.rol) {
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
    <div
      className={cn(
        "flex h-full flex-col bg-primary text-primary-foreground transition-all duration-300 ease-in-out",
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-white/10", isCollapsed && !isMobile ? 'justify-center' : 'px-4 justify-between')}>
         <Link href="/" className="flex items-center gap-1.5">
            {(!isCollapsed || isMobile) ? (
              <div className="flex items-center font-cursive text-2xl text-white">
                <span>Clar</span>
                <HeartPulse className="relative -bottom-1 mx-[-1px] h-6 w-6 text-accent"/>
                <span className="font-bold">Mi Salud</span>
              </div>
            ) : (
               <HeartPulse className="h-7 w-7 text-white" />
            )}
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white hover:bg-white/10">
            <X className="h-6 w-6"/>
          </Button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <NavItem key={item.href} {...item} isCollapsed={isCollapsed && !isMobile} />
          ))}
        </ul>
        <hr className="my-4 border-white/10" />
         <ul className="space-y-1">
          {commonMenu.map((item) => (
            <NavItem key={item.href} {...item} isCollapsed={isCollapsed && !isMobile} />
          ))}
        </ul>
      </nav>
    </div>
  );
}
