
import { Bell, Globe, RefreshCw, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HeaderAlerts } from './HeaderAlerts';

export function Header() {
  const { user } = useAuth();
  const { logout, loading } = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-16 bg-geo-gray border-b border-geo-gray-light flex items-center justify-between px-6">
      <div className="flex items-center">

      </div>
      
      <div className="flex items-center space-x-4">
        <HeaderAlerts />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-geo-text hover:text-white hover:bg-geo-gray-light"
            >
              <User className="h-4 w-4 mr-2" />
              {user?.user_metadata?.full_name || 'Usuario'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-geo-gray border-geo-gray-light">
            <DropdownMenuItem className="text-white hover:bg-geo-gray-light">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-geo-gray-light" />
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={loading}
              className="text-red-400 hover:bg-geo-gray-light hover:text-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {loading ? 'Cerrando...' : 'Cerrar sesión'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
