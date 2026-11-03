import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/ui/input.jsx';
import { Button } from '../components/ui/button.jsx';
import { toast } from 'sonner';
import { login } from '../services/api.js';

import blendedLogo from '../assets/blended.png';
import captureImg from '../assets/capture.png';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res && res.user) {
        toast.success('Acceso autorizado', {
          description: `Bienvenido, ${res.user.nombre} (${res.user.rol})`
        });
        onLoginSuccess(res.user);
      } else {
        throw new Error('Respuesta de autenticación incompleta.');
      }
    } catch (err) {
      console.error('[AUTH ERROR]:', err);
      toast.error('Credenciales inválidas', {
        description: 'El correo electrónico o la contraseña ingresada no son correctos.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Curva de animación estilo Apple/Linear (ultra suave)
  const smoothEase = [0.16, 1, 0.3, 1];

  // Orquestador del Panel Izquierdo (Logo -> Título -> Subtítulo -> Capture)
  const leftContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.08
      }
    }
  };

  const leftItemVariants = {
    hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.75,
        ease: smoothEase
      }
    }
  };

  const captureVariants = {
    hidden: { opacity: 0, y: 36, scale: 0.98, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.95,
        ease: smoothEase
      }
    }
  };

  // Orquestador del Panel Derecho sincronizado (Cabecera -> Inputs -> Opciones -> Botón)
  const rightContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.22
      }
    }
  };

  const rightItemVariants = {
    hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.65,
        ease: smoothEase
      }
    }
  };

  return (
    <div className="min-h-screen md:h-screen w-full flex flex-col md:flex-row bg-white font-sans overflow-y-auto md:overflow-hidden">
      {/* Panel Izquierdo: Animación secuencial y resplandor blanco tenue (visible en desktop) */}
      <motion.div
        variants={leftContainerVariants}
        initial="hidden"
        animate="visible"
        className="hidden md:flex relative md:w-1/2 h-full bg-zinc-950 text-zinc-50 flex-col justify-between pt-12 md:pt-16 pl-6 md:pl-14 pr-6 z-0 overflow-visible select-none"
      >
        {/* Cabecera: Logo y Título secuenciales */}
        <div className="relative flex flex-col items-center text-center space-y-4 max-w-xl mx-auto z-20 px-4">
          <motion.img
            variants={leftItemVariants}
            src={blendedLogo}
            alt="Blended Logo"
            className="h-20 md:h-24 w-auto object-contain brightness-0 invert"
          />
          <div className="space-y-2">
            <motion.h1
              variants={leftItemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight"
            >
              Plataforma de Análisis y Detección
            </motion.h1>
            <motion.p
              variants={leftItemVariants}
              className="text-sm md:text-base text-zinc-400 font-medium tracking-wide"
            >
              Prevención de Deserción Estudiantil • Telemetría LMS
            </motion.p>
          </div>
        </div>

        {/* Contenedor de la captura con halo blanco sutil y elegante */}
        <motion.div
          variants={captureVariants}
          className="relative mt-8 w-[135%] md:w-[142%] self-start pointer-events-none"
        >
          {/* Halo blanco muy tenue y difuminado detrás del mockup */}
          <div className="absolute -inset-6 bg-white/[0.04] blur-[70px] rounded-3xl -z-10" />

          <div className="rounded-t-2xl bg-zinc-900/60 p-2 pb-0 ring-1 ring-white/15 backdrop-blur-md shadow-[0_-12px_45px_-10px_rgba(255,255,255,0.06),0_-20px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="rounded-t-xl overflow-hidden border-t border-x border-zinc-800/90 bg-zinc-950">
              {/* Barra superior minimalista */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-zinc-400">
                  blended.analytics/dashboard
                </span>
              </div>

              {/* Imagen capture con desvanecido inferior corto */}
              <div className="relative">
                <img
                  src={captureImg}
                  alt="UI Capture"
                  className="w-full h-auto object-cover object-left-top"
                />
                <div className="absolute bottom-0 inset-x-0 h-10 md:h-12 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Panel Derecho: Formulario con entrada secuencial sincronizada (100% responsivo) */}
      <div className="w-full md:w-1/2 min-h-screen md:h-full flex items-center justify-center p-6 sm:p-10 md:p-16 bg-white z-10 shadow-[-25px_0_50px_rgba(0,0,0,0.18)]">
        <motion.div
          variants={rightContainerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm space-y-6 sm:space-y-7"
        >
          {/* Logo visible únicamente en pantallas móviles */}
          <motion.div variants={rightItemVariants} className="flex md:hidden flex-col items-center text-center space-y-2 pb-2">
            <img
              src={blendedLogo}
              alt="Blended Logo"
              className="h-10 w-auto object-contain"
            />
            <p className="text-xs text-zinc-500 font-medium">
              Prevención de Deserción • Blended Learning
            </p>
          </motion.div>

          <motion.div variants={rightItemVariants} className="space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
              Iniciar sesión
            </h2>
            <p className="text-sm text-zinc-500">
              Ingresa tus credenciales para acceder a la plataforma
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={rightItemVariants} className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coord@universidad.edu"
                  required
                  className="pl-10 h-10 text-sm"
                />
              </div>
            </motion.div>

            <motion.div variants={rightItemVariants} className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 h-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            

            <motion.div variants={rightItemVariants}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 font-medium cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Ingresar al sistema</span>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}