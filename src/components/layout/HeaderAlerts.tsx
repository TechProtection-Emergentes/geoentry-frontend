import { useState, useEffect } from 'react';
import { Bell, ShieldAlert, ShieldCheck, AlertTriangle, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/supabase/client';
import { Database } from '@/supabase/supabase';
import { useAuth } from '@/contexts/AuthContext';

type Alert = Database['public']['Tables']['alerts']['Row'];

export function HeaderAlerts() {
  const { session } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [householdId, setHouseholdId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      initAlerts();
    }
  }, [session]);

  const initAlerts = async () => {
    try {
      // Find user's household
      const { data: userHousehold } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('profile_id', session!.user.id)
        .limit(1)
        .single();

      if (userHousehold?.household_id) {
        setHouseholdId(userHousehold.household_id);
        fetchAlerts(userHousehold.household_id);
        subscribeToAlerts(userHousehold.household_id);
      }
    } catch (error) {
      console.error('Error initializing alerts:', error);
    }
  };

  const fetchAlerts = async (hId: string) => {
    const { data } = await supabase
      .from('alerts')
      .select('*')
      .eq('household_id', hId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (data) {
      setAlerts(data as Alert[]);
      setUnreadCount(data.filter(a => !a.is_read).length);
    }
  };

  const subscribeToAlerts = (hId: string) => {
    supabase
      .channel('alerts-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `household_id=eq.${hId}`
        },
        (payload) => {
          const newAlert = payload.new as Alert;
          setAlerts(prev => [newAlert, ...prev].slice(0, 10));
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();
  };

  const markAsRead = async (alertId: string) => {
    try {
      await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId);
        
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const getAlertIcon = (severity: string | null) => {
    switch (severity) {
      case 'CRITICAL': return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'INFO': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <ShieldCheck className="h-5 w-5 text-geo-blue" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-geo-text hover:text-white hover:bg-geo-gray-light">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-geo-gray border-geo-gray-light p-0">
        <div className="p-3 border-b border-geo-gray-light bg-geo-darker/50">
          <h3 className="font-semibold text-white">Notificaciones</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-geo-text-muted text-sm">
              No tienes notificaciones
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 border-b border-geo-gray-light flex gap-3 ${!alert.is_read ? 'bg-geo-blue/5' : ''}`}
              >
                <div className="shrink-0 mt-1">
                  {getAlertIcon(alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!alert.is_read ? 'font-medium text-white' : 'text-geo-text-muted'}`}>
                    {alert.title}
                  </p>
                  <p className="text-xs text-geo-text-muted mt-1 break-words">
                    {alert.message}
                  </p>
                  <p className="text-[10px] text-geo-text mt-1 opacity-60">
                    {new Date(alert.created_at!).toLocaleString()}
                  </p>
                </div>
                {!alert.is_read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 shrink-0" 
                    onClick={() => markAsRead(alert.id)}
                    title="Marcar como leída"
                  >
                    <Check className="h-3 w-3 text-geo-blue" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
