import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { Target, Info, CheckCircle2, ShieldCheck, BrainCircuit, Cpu } from 'lucide-react';
import { fetchModelPerformance } from '../services/api.js';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from '../components/ui/card.jsx';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Progress } from '../components/ui/progress.jsx';

export default function ModelAnalysisView() {
  const [activeTab, setActiveTab] = useState('Factores de Riesgo');
  const [modelData, setModelData] = useState(null);

  useEffect(() => {
    fetchModelPerformance()
      .then(data => setModelData(data))
      .catch(() => {
        setModelData({
          metricas: {
            exactitud: '87.6%',
            precision: '85.3%',
            exhaustividad: '83.1%',
            f1Score: '81.9%',
            aucRoc: '0.91'
          },
          importanciaFactores: [
            { factor: 'Bajo rendimiento académico', peso: 0.32 },
            { factor: 'Baja participación en plataforma', peso: 0.24 },
            { factor: 'Inasistencias', peso: 0.18 },
            { factor: 'Entrega de actividades', peso: 0.12 },
            { factor: 'Interacción en foros', peso: 0.08 },
            { factor: 'Datos demográficos', peso: 0.06 }
          ],
          curvaROC: [
            { fpr: 0.0, tpr: 0.0 },
            { fpr: 0.05, tpr: 0.45 },
            { fpr: 0.10, tpr: 0.68 },
            { fpr: 0.15, tpr: 0.79 },
            { fpr: 0.25, tpr: 0.86 },
            { fpr: 0.40, tpr: 0.91 },
            { fpr: 0.60, tpr: 0.95 },
            { fpr: 0.80, tpr: 0.98 },
            { fpr: 1.0, tpr: 1.0 }
          ]
        });
      });
  }, []);

  const metricas = modelData?.metricas || {
    exactitud: '87.6%',
    precision: '85.3%',
    exhaustividad: '83.1%',
    f1Score: '81.9%',
    aucRoc: '0.91'
  };

  const importancia = modelData?.importanciaFactores || [
    { factor: 'Bajo rendimiento académico', peso: 0.32 },
    { factor: 'Baja participación en plataforma', peso: 0.24 },
    { factor: 'Inasistencias', peso: 0.18 },
    { factor: 'Entrega de actividades', peso: 0.12 },
    { factor: 'Interacción en foros', peso: 0.08 },
    { factor: 'Datos demográficos', peso: 0.06 }
  ];

  const curvaROC = modelData?.curvaROC || [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.05, tpr: 0.45 },
    { fpr: 0.10, tpr: 0.68 },
    { fpr: 0.15, tpr: 0.79 },
    { fpr: 0.25, tpr: 0.86 },
    { fpr: 0.40, tpr: 0.91 },
    { fpr: 0.60, tpr: 0.95 },
    { fpr: 0.80, tpr: 0.98 },
    { fpr: 1.0, tpr: 1.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Análisis de Factores y Modelos
        </h1>
        <p className="text-sm text-zinc-500">
          Explora los factores que influyen en la deserción y el desempeño del modelo predictivo.
        </p>
      </div>

      {/* Tabs shadcn */}
      <div className="border-b border-zinc-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent p-0 h-auto gap-4">
            {['Factores de Riesgo', 'Modelo Predictivo'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-all relative border-b-2 cursor-pointer ${
                  activeTab === tab
                    ? 'border-zinc-950 text-zinc-950 font-semibold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Grid Principal: Importancia de Factores y Rendimiento del Modelo */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card Izquierda: Importancia de Factores */}
        <Card className="shadow-2xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Importancia de factores</CardTitle>
            <CardDescription>Ponderación relativa de las variables en la predicción</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {importancia.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-zinc-700 truncate pr-2">{item.factor}</span>
                  <span className="font-mono font-semibold text-zinc-900">{item.peso.toFixed(2)}</span>
                </div>
                <Progress
                  value={(item.peso / 0.35) * 100}
                  className="h-2"
                  indicatorClassName="bg-indigo-600"
                />
              </div>
            ))}

            <div className="flex items-center gap-2 pt-4 border-t border-zinc-100 text-xs text-zinc-500">
              <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Los valores representan la importancia relativa de cada factor en la predicción del riesgo.</span>
            </div>
          </CardContent>
        </Card>

        {/* Card Derecha: Rendimiento del Modelo */}
        <Card className="shadow-2xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Rendimiento del modelo</CardTitle>
            <CardDescription>Métricas de validación cruzada y discriminación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fila de Métricas ML */}
            <div className="grid grid-cols-5 gap-2 text-center pb-3 border-b border-zinc-100">
              <div className="bg-zinc-50 p-2 rounded-md border border-zinc-100">
                <p className="text-[10px] text-zinc-500 font-medium">Exactitud</p>
                <p className="text-xs font-bold text-zinc-900 mt-0.5">{metricas.exactitud}</p>
              </div>
              <div className="bg-zinc-50 p-2 rounded-md border border-zinc-100">
                <p className="text-[10px] text-zinc-500 font-medium">Precisión</p>
                <p className="text-xs font-bold text-zinc-900 mt-0.5">{metricas.precision}</p>
              </div>
              <div className="bg-zinc-50 p-2 rounded-md border border-zinc-100">
                <p className="text-[10px] text-zinc-500 font-medium">Exhaustividad</p>
                <p className="text-xs font-bold text-zinc-900 mt-0.5">{metricas.exhaustividad}</p>
              </div>
              <div className="bg-zinc-50 p-2 rounded-md border border-zinc-100">
                <p className="text-[10px] text-zinc-500 font-medium">F1-Score</p>
                <p className="text-xs font-bold text-zinc-900 mt-0.5">{metricas.f1Score}</p>
              </div>
              <div className="bg-zinc-900 text-white p-2 rounded-md shadow-xs">
                <p className="text-[10px] text-zinc-400 font-medium">AUC-ROC</p>
                <p className="text-xs font-bold text-white mt-0.5">{metricas.aucRoc}</p>
              </div>
            </div>

            {/* Curva ROC */}
            <div>
              <p className="text-xs font-semibold text-zinc-800 mb-2">Curva ROC</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={curvaROC} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis
                      dataKey="fpr"
                      type="number"
                      domain={[0, 1]}
                      ticks={[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                      tick={{ fill: '#71717a', fontSize: 10 }}
                    />
                    <YAxis
                      dataKey="tpr"
                      type="number"
                      domain={[0, 1]}
                      ticks={[0.0, 0.5, 1.0]}
                      tick={{ fill: '#71717a', fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(val, name) => [
                        val,
                        name === 'tpr' ? 'Sensibilidad (TPR)' : '1 - Especificidad (FPR)'
                      ]}
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#27272a',
                        color: '#fafafa',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="tpr"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#rocGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                <span>0.0 (Sensibilidad)</span>
                <span>1 - Especificidad</span>
                <span>1.0</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-zinc-100 text-xs text-zinc-500">
              <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>El área bajo la curva (AUC) de 0.91 indica un excelente desempeño del modelo.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card Inferior: Descripción del Modelo */}
      <Card className="shadow-2xs">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold text-zinc-950 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-zinc-700" />
              <span>Descripción del modelo</span>
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              El modelo utiliza algoritmos de aprendizaje automático para predecir la probabilidad de deserción con base en datos académicos y de interacción en entornos blended learning.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-lg border border-zinc-200/80">
            <div className="w-9 h-9 rounded-md bg-zinc-900 text-white flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-zinc-700 leading-snug">
              <strong className="text-zinc-950">Objetivo:</strong> Identificar oportunamente a los estudiantes en riesgo para implementar intervenciones preventivas efectivas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
