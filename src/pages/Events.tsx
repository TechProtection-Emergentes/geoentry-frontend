
import { Calendar, ArrowUp, ArrowDown, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEvents, useEventStats } from '@/hooks/useEvents';
import { useDevices } from '@/hooks/useDevices';
import { useState } from 'react';

export default function Events() {
  const { data: events = [], isLoading, error } = useEvents();
  const { data: devices = [] } = useDevices();
  const stats = useEventStats(events);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterDevice, setFilterDevice] = useState('all');

  const getEventIcon = (type: string) => {
    return type === 'enter' ? ArrowUp : ArrowDown;
  };

  const getEventColor = (type: string) => {
    return type === 'enter' ? 'text-green-400' : 'text-red-400';
  };

  const getEventTypeText = (type: string) => {
    return type === 'enter' ? 'Entrada' : 'Salida';
  };

  const getDeviceName = (deviceId: string | null) => {
    if (!deviceId) return 'Dispositivo desconocido';
    const device = devices.find(d => d.id === deviceId);
    return device ? device.name : 'Dispositivo desconocido';
  };

  const statsCards = [
    { title: 'Total Eventos', value: stats.totalEvents.toString(), icon: Calendar, color: 'text-blue-400' },
    { title: 'Eventos Hoy', value: stats.todayEvents.toString(), icon: Calendar, color: 'text-green-400' },
    { title: 'Entradas', value: stats.enterEvents.toString(), icon: ArrowUp, color: 'text-green-400' },
    { title: 'Salidas', value: stats.exitEvents.toString(), icon: ArrowDown, color: 'text-red-400' },
  ];

  const filteredEvents = events.filter(event => {
    const deviceName = getDeviceName(event.device_id);
    const matchesSearch = event.home_location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || 
                       (filterType === 'enter' && event.type === 'enter') ||
                       (filterType === 'exit' && event.type === 'exit');

    const matchesLocation = filterLocation === 'all' || event.home_location_name === filterLocation;
    
    const matchesDevice = filterDevice === 'all' || event.device_id === filterDevice;

    return matchesSearch && matchesType && matchesLocation && matchesDevice;
  });

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const currentEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Cargando eventos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error al cargar eventos: {error.message}</div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="space-y-6">
        {}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Eventos de Proximidad</h1>
            <p className="text-geo-text-muted">Historial completo de entradas y salidas de dispositivos</p>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index} className="bg-geo-gray border-geo-gray-light">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-geo-text-muted text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full bg-geo-darker ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-geo-gray border-geo-gray-light">
          <CardContent className="p-8">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-geo-text-muted mx-auto mb-4" />
              <p className="text-geo-text-muted">
                No hay eventos registrados. Los eventos aparecerán aquí cuando los dispositivos entren o salgan de las ubicaciones configuradas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Eventos de Proximidad</h1>
          <p className="text-geo-text-muted">Historial completo de entradas y salidas de dispositivos</p>
        </div>
      </div>



      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="bg-geo-gray border-geo-gray-light">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-geo-text-muted text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full bg-geo-darker ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {}
      <Card className="bg-geo-gray border-geo-gray-light">
        <CardHeader>
          <CardTitle className="text-white">Historial de Eventos ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-geo-text-muted mx-auto mb-4" />
                <p className="text-geo-text-muted">
                  {events.length === 0 ? 'No hay eventos registrados' : 'No se encontraron eventos con los filtros aplicados'}
                </p>
              </div>
            ) : (
              currentEvents.map((event) => {
                const EventIcon = getEventIcon(event.type);
                const eventColor = getEventColor(event.type);
                const eventTypeText = getEventTypeText(event.type);
                const eventDate = event.created_at ? new Date(event.created_at) : new Date();
                
                return (
                  <div key={event.id} className="bg-geo-darker p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full bg-geo-gray mr-4 ${eventColor}`}>
                        <EventIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            event.type === 'enter' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {eventTypeText}
                          </span>
                          <span className="text-white font-medium">
                            {getDeviceName(event.device_id)}
                          </span>
                        </div>
                        <div className="flex items-center text-geo-text-muted text-sm mt-1">
                          <span className="mr-4">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {event.home_location_name}
                          </span>
                          <span>🧭 Distancia: {event.distance}m</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{eventDate.toLocaleDateString('es-ES')}</p>
                      <p className="text-geo-text-muted text-sm">{eventDate.toLocaleTimeString('es-ES')}</p>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-geo-gray-light mt-6">
                <span className="text-sm text-geo-text-muted">
                  Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)} de {filteredEvents.length} eventos
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-geo-darker border border-geo-gray-light rounded-md text-white hover:bg-geo-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-geo-darker border border-geo-gray-light rounded-md text-white hover:bg-geo-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
