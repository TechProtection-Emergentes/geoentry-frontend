import { BrainCircuit, Activity, Bot, Zap, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAILogs } from '@/hooks/useAILogs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AILogs() {
  const { data: logs = [], isLoading, error } = useAILogs();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-white flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 animate-pulse text-purple-400" />
            <span>Consultando historial neuronal...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error al cargar registros de IA: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-purple-400" />
            Decisiones IA
          </h1>
          <p className="text-geo-text-muted">Auditoría transparente del razonamiento de Ollama en tiempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-geo-gray border-geo-gray-light">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-geo-text-muted text-sm font-medium">Inferencias Totales</p>
                <p className="text-2xl font-bold text-white">{logs.length}</p>
              </div>
              <div className="p-2 rounded-full bg-geo-darker text-purple-400">
                <Bot className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-geo-gray border-geo-gray-light">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-geo-text-muted text-sm font-medium">Confianza Promedio</p>
                <p className="text-2xl font-bold text-green-400">
                  {logs.length > 0 
                    ? Math.round(logs.reduce((acc, l) => acc + (l.ai_confidence || 0), 0) / logs.length * 100)
                    : 0}%
                </p>
              </div>
              <div className="p-2 rounded-full bg-geo-darker text-green-400">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-geo-gray border-geo-gray-light">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-geo-text-muted text-sm font-medium">Automatizaciones</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {logs.reduce((acc, l) => acc + (l.ai_response?.actions?.length || 0), 0)}
                </p>
              </div>
              <div className="p-2 rounded-full bg-geo-darker text-yellow-400">
                <Zap className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-geo-gray border-geo-gray-light">
        <CardHeader>
          <CardTitle className="text-white">Registro de Inferencias</CardTitle>
          <CardDescription className="text-geo-text-muted">
            Historial de eventos de proximidad evaluados por el modelo local.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {logs.length === 0 ? (
              <div className="text-center py-8">
                <BrainCircuit className="h-12 w-12 text-geo-text-muted mx-auto mb-4" />
                <p className="text-geo-text-muted">No hay decisiones registradas aún.</p>
              </div>
            ) : (
              logs.map((log) => {
                const isHighConfidence = (log.ai_confidence || 0) >= 0.7;
                
                return (
                  <div key={log.id} className="bg-geo-darker p-5 rounded-lg border border-geo-gray-light hover:border-purple-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${isHighConfidence ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {isHighConfidence ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-lg">
                            {log.proximity_event?.type === 'enter' ? 'Geocerca: Entrada' : 'Geocerca: Salida'} 
                            {' a '} {log.proximity_event?.home_location_name || 'Ubicación Desconocida'}
                          </h3>
                          <span className="text-geo-text-muted text-sm">
                            {format(new Date(log.created_at), "d 'de' MMMM, HH:mm:ss", { locale: es })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isHighConfidence ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          Confianza: {Math.round((log.ai_confidence || 0) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                      {/* Context Provided */}
                      <div className="bg-geo-gray/50 p-4 rounded-md">
                        <h4 className="text-purple-300 text-sm font-semibold mb-2 flex items-center gap-1">
                          <Info className="h-4 w-4" />
                          Contexto Analizado
                        </h4>
                        <ul className="text-sm text-geo-text-muted space-y-1">
                          <li><strong className="text-gray-300">Hora:</strong> {log.context_snapshot?.time}</li>
                          <li><strong className="text-gray-300">Fin de semana:</strong> {log.context_snapshot?.isWeekend ? 'Sí' : 'No'}</li>
                          <li><strong className="text-gray-300">Hábitos:</strong> {log.context_snapshot?.userHabitsSummary}</li>
                        </ul>
                      </div>

                      {/* Actions Taken */}
                      <div className="bg-geo-gray/50 p-4 rounded-md border-l-2 border-purple-500">
                        <h4 className="text-purple-300 text-sm font-semibold mb-2 flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          Acciones Ejecutadas
                        </h4>
                        {log.ai_response?.actions && log.ai_response.actions.length > 0 ? (
                          <div className="space-y-2">
                            {log.ai_response.actions.map((action: any, idx: number) => (
                              <div key={idx} className="bg-geo-darker p-2 rounded text-sm flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-gray-200 truncate pr-2">Disp: {action.deviceId}</span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${action.targetState ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-600 text-gray-300'}`}>
                                    {action.targetState ? 'ENCENDER' : 'APAGAR'}
                                  </span>
                                </div>
                                <span className="text-geo-text-muted text-xs italic">" {action.reason} "</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-geo-text-muted italic">La IA determinó que no era necesario alterar el estado de ningún dispositivo.</p>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
