import React from 'react';
import { AnimateIcon } from '@animate-ui/react/icons';
import { LayoutDashboard } from '../animate-ui/icons/layout-dashboard.jsx';
import { Upload } from '../animate-ui/icons/upload.jsx';
import { Users } from '../animate-ui/icons/users.jsx';
import { LineChart } from '../animate-ui/icons/line-chart.jsx';
import { ShieldAlert } from '../animate-ui/icons/shield-alert.jsx';
import { Bell } from '../animate-ui/icons/bell.jsx';
import { FileText } from '../animate-ui/icons/file-text.jsx';
import { HeartHandshake } from '../animate-ui/icons/heart-handshake.jsx';
import { Settings } from '../animate-ui/icons/settings.jsx';
import { GraduationCap } from '../animate-ui/icons/graduation-cap.jsx';
import { LogOut } from '../animate-ui/icons/log-out.jsx';

import { Avatar, AvatarFallback } from '../ui/avatar.jsx';
import { Button } from '../ui/button.jsx';

export default function Sidebar({ currentView, onNavigate, onLogout, user }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'importar', label: 'Importar Datos', icon: Upload },
    { id: 'students', label: 'Estudiantes', icon: Users },
    { id: 'analysis', label: 'Análisis & Modelos', icon: LineChart },
    { id: 'risk', label: 'Riesgo de Deserción', icon: ShieldAlert },
    { id: 'alerts', label: 'Alertas', icon: Bell },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'interventions', label: 'Intervenciones', icon: HeartHandshake },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="w-48 bg-zinc-950 text-zinc-300 flex flex-col shrink-0 h-full select-none rounded-2xl border border-zinc-800/90 shadow-sm overflow-hidden">
      {/* Brand Header */}
      <div className="shrink-0 p-3.5 border-b border-zinc-800/80">
        <AnimateIcon animateOnHover asChild>
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-xs shrink-0">
              <GraduationCap size={16} />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-zinc-50 text-[11px] tracking-tight uppercase truncate">
                Blended Risk
              </h1>
              <p className="text-[9px] text-zinc-400 font-medium truncate">
                Learning Analytics
              </p>
            </div>
          </div>
        </AnimateIcon>
      </div>

      {/* Navigation List - scrollable independientemente */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto min-h-0">
        <div className="px-2 pb-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
          Navegación
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <AnimateIcon key={item.id} animateOnHover asChild>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-150 ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-100 font-semibold border border-zinc-800/80 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <div className={`shrink-0 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`}>
                  <Icon size={15} />
                </div>
                <span className="truncate text-[11px]">{item.label}</span>
              </button>
            </AnimateIcon>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="shrink-0 p-2.5 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold">
            <AvatarFallback className="bg-zinc-900 text-zinc-200 text-[11px]">
              {user?.nombre ? user.nombre.charAt(0) : 'C'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-zinc-100 truncate leading-tight">
              {user?.nombre || 'Coordinador'}
            </p>
            <p className="text-[9px] text-zinc-400 font-mono truncate">
              {user?.email || 'coord@universidad.edu'}
            </p>
          </div>
        </div>

        <AnimateIcon animateOnHover asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            title="Cerrar sesión"
            className="h-7 w-7 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 cursor-pointer"
          >
            <LogOut size={14} />
          </Button>
        </AnimateIcon>
      </div>
    </aside>
  );
}
