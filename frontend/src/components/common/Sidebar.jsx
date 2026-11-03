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
    <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col shrink-0 h-full select-none rounded-2xl border border-zinc-800 shadow-md overflow-hidden">
      {/* Brand Header */}
      <div className="shrink-0 p-5 border-b border-zinc-800/80">
        <AnimateIcon animateOnHover asChild>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-xs shrink-0">
              <GraduationCap size={18} />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-zinc-50 text-xs tracking-tight uppercase truncate">
                Prevención de Deserción
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium truncate mt-0.5">
                Entornos Blended Learning
              </p>
            </div>
          </div>
        </AnimateIcon>
      </div>

      {/* Navigation List - scrollable independientemente */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto min-h-0">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Navegación
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <AnimateIcon key={item.id} animateOnHover asChild>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors duration-150 ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-100 font-semibold border border-zinc-800/80 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <div className={`shrink-0 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`}>
                  <Icon size={16} />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            </AnimateIcon>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="shrink-0 p-3.5 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold">
            <AvatarFallback className="bg-zinc-900 text-zinc-200">
              {user?.nombre ? user.nombre.charAt(0) : 'C'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-100 truncate leading-tight">
              {user?.nombre || 'Coordinador'}
            </p>
            <p className="text-[10px] text-zinc-400 font-mono truncate">
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
            className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 cursor-pointer"
          >
            <LogOut size={16} />
          </Button>
        </AnimateIcon>
      </div>
    </aside>
  );
}
