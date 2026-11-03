import React from 'react';
import { LayoutDashboard, Users, GraduationCap, ShieldAlert, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, onSelectTab, user }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Titular */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-xl text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">Analytics Blended</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
                  MVP v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Detección Preventiva de Deserción Universitaria</p>
            </div>
          </div>

          {/* Navegación por pestañas */}
          <nav className="flex space-x-1 sm:space-x-2 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard General</span>
            </button>

            <button
              onClick={() => onSelectTab('students')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'students'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Directorio Estudiantil</span>
            </button>
          </nav>

          {/* Rol y Perfil */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-800">{user?.nombre || 'Administrador Académico'}</p>
              <p className="text-xs text-slate-500">{user?.rol || 'Coordinación'}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
              {user?.nombre ? user.nombre.charAt(0) : 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
