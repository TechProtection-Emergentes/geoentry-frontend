
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Home, 
  MapIcon, 
  Smartphone, 
  Activity, 
  BarChart3, 
  User,
  LogOut,
  Globe,
  HelpCircle,
  BrainCircuit,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/useLogout';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Ubicaciones', href: '/ubicaciones', icon: MapIcon },
  { name: 'Dispositivos', href: '/dispositivos', icon: Smartphone },
  { name: 'Eventos', href: '/eventos', icon: Activity },
  { name: 'Analíticas', href: '/analiticas', icon: BarChart3 },
  { name: 'Decisiones IA', href: '/ia-logs', icon: BrainCircuit },
  { name: 'Facturación', href: '/facturacion', icon: CreditCard },
  { name: 'Soporte', href: '/soporte', icon: HelpCircle },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { logout, loading } = useLogout();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <div className="w-64 h-screen bg-geo-gray border-r border-geo-gray-light flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-geo-gray-light">
        <div className="flex items-center">
          <MapPin className="h-8 w-8 text-geo-blue mr-2" />
          <div>
            <h1 className="text-xl font-bold text-white">GeoEntry</h1>
            <p className="text-xs text-geo-text-muted">v3.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-geo-blue text-white"
                      : "text-geo-text hover:bg-geo-gray-light hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-geo-gray-light">
        <div className="mb-4">
          <div className="flex items-center text-xs text-geo-text-muted mb-2">
            <Globe className="h-3 w-3 mr-1" />
            Estado API
            <span className="ml-auto bg-blue-600 text-white px-2 py-0.5 rounded text-xs">OK</span>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 bg-geo-blue rounded-full flex items-center justify-center mr-3">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.user_metadata?.full_name || 'Usuario'}
            </p>
            <p className="text-xs text-geo-text-muted truncate">
              {user?.email || 'Sin email'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-geo-text hover:bg-geo-gray-light hover:text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="mr-3 h-4 w-4" />
          {loading ? 'Cerrando...' : 'Cerrar Sesión'}
        </button>
      </div>
    </div>
  );
}
