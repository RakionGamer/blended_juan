import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/common/Sidebar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardView from './pages/DashboardView.jsx';
import StudentsView from './pages/StudentsView.jsx';
import StudentProfileView from './pages/StudentProfileView.jsx';
import ModelAnalysisView from './pages/ModelAnalysisView.jsx';
import ImportDataView from './pages/ImportDataView.jsx';
import ReportsView from './pages/ReportsView.jsx';
import InterventionsView from './pages/InterventionsView.jsx';
import SettingsView from './pages/SettingsView.jsx';
import { fetchDashboardData, fetchStudents, setToken, getToken } from './services/api.js';
import { LogOut } from 'lucide-react';
import { Button } from './components/ui/button.jsx';
import { Badge } from './components/ui/badge.jsx';
import { Avatar, AvatarFallback } from './components/ui/avatar.jsx';
import { Card, CardContent } from './components/ui/card.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import { toast } from 'sonner';

export default function App() {
  // Estado real de autenticación basado en token existente
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('token')));
  
  // Usuario real en sesión
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtros del Directorio de Estudiantes
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');

  const loadData = useCallback(async () => {
    if (!getToken()) {
      setIsAuthenticated(false);
      return;
    }

    try {
      setLoading(true);
      const [dash, studList] = await Promise.all([
        fetchDashboardData().catch((err) => {
          if (err.message?.includes('No autorizado')) {
            handleLogout();
          }
          return null;
        }),
        fetchStudents({ riesgo: riskFilter, facultad: facultyFilter, search }).catch(() => [])
      ]);

      if (dash) setDashboardData(dash);
      if (studList) setStudents(studList);
    } catch (err) {
      console.error('Error cargando datos del sistema:', err);
    } finally {
      setLoading(false);
    }
  }, [riskFilter, facultyFilter, search]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setToken(''); // Destruir token JWT
    localStorage.removeItem('user'); // Destruir datos de usuario
    setUser(null);
    setIsAuthenticated(false);
    setDashboardData(null);
    setStudents([]);
    setSelectedStudent(null);
    toast.info('Sesión cerrada', {
      description: 'Has salido de la plataforma de forma segura.'
    });
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setCurrentView('profile');
  };

  const handleBackToStudents = () => {
    setCurrentView('students');
  };

  const handleNavigateToStudentsWithRisk = () => {
    setRiskFilter('Alto');
    setCurrentView('students');
  };

  return (
    <>
      {/* Toast animado al frente (Sonner shadcn) */}
      <Toaster />

      {/* Control estricto: Si NO está autenticado, muestra ÚNICAMENTE la pantalla de Login */}
      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="h-screen w-full flex overflow-hidden bg-zinc-50 p-2.5 sm:p-3 gap-3 font-sans text-zinc-950">
          {/* Sidebar Flotante como Tarjeta */}
          <Sidebar
            currentView={currentView === 'profile' ? 'students' : currentView}
            onNavigate={(view) => {
              if (view === 'risk' || view === 'alerts') {
                setRiskFilter('Alto');
                setCurrentView('students');
              } else {
                setCurrentView(view);
              }
            }}
            onLogout={handleLogout}
            user={user}
          />

          {/* Contenedor Principal Flotante como Tarjeta */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white rounded-2xl border border-zinc-200/80 shadow-2xs">
            {/* Barra Superior estilo shadcn - Negro Elegante y Compacto */}
            <header className="shrink-0 bg-zinc-950 border-b border-zinc-900 px-5 py-2 h-12 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-zinc-800 text-zinc-300 font-medium text-[11px] bg-zinc-900/80 py-0.5 px-2">
                  Campus Central
                </Badge>
                <span className="text-zinc-700">/</span>
                <span className="text-xs font-medium text-zinc-400">
                  Modalidad Blended Learning
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium text-zinc-100 leading-tight">
                      {user?.nombre || 'Coordinación'}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      {user?.rol || 'Coordinador'}
                    </p>
                  </div>
                  <Avatar className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold">
                    <AvatarFallback className="bg-zinc-900 text-zinc-200 rounded-lg">
                      {user?.nombre ? user.nombre.charAt(0) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </header>

            {/* Contenedor con Scroll Vertical Suave (scrollbar en el borde derecho) */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <main className="p-6 md:p-8 max-w-7xl w-full mx-auto pb-16">
                {loading && !dashboardData && students.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="w-7 h-7 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-medium text-zinc-500 mt-3 font-mono">
                      Cargando componentes analíticos...
                    </p>
                  </div>
                ) : (
                  <div key={currentView} className="animate-view-fade-in">
                    {currentView === 'dashboard' && (
                      <DashboardView
                        dashboardData={dashboardData}
                        onNavigateToStudents={handleNavigateToStudentsWithRisk}
                        onNavigateToAlerts={handleNavigateToStudentsWithRisk}
                      />
                    )}

                    {currentView === 'importar' && (
                      <ImportDataView
                        onImportSuccess={() => {
                          loadData();
                        }}
                        onNavigateToStudents={() => {
                          loadData();
                          setCurrentView('students');
                        }}
                        onNavigateToDashboard={() => {
                          loadData();
                          setCurrentView('dashboard');
                        }}
                      />
                    )}

                    {currentView === 'students' && (
                      <StudentsView
                        students={students}
                        search={search}
                        onSearchChange={setSearch}
                        riskFilter={riskFilter}
                        onRiskFilterChange={setRiskFilter}
                        facultyFilter={facultyFilter}
                        onFacultyFilterChange={setFacultyFilter}
                        onResetFilters={() => {
                          setSearch('');
                          setRiskFilter('');
                          setFacultyFilter('');
                        }}
                        onSelectStudent={handleSelectStudent}
                      />
                    )}

                    {currentView === 'profile' && (
                      <StudentProfileView
                        student={selectedStudent}
                        onBack={handleBackToStudents}
                      />
                    )}

                    {currentView === 'analysis' && (
                      <ModelAnalysisView />
                    )}

                    {currentView === 'reports' && (
                      <ReportsView
                        dashboardData={dashboardData}
                        students={students}
                        onNavigateToStudents={() => setCurrentView('students')}
                      />
                    )}

                    {currentView === 'interventions' && (
                      <InterventionsView
                        students={students}
                        onSelectStudent={handleSelectStudent}
                      />
                    )}

                    {currentView === 'settings' && (
                      <SettingsView />
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
