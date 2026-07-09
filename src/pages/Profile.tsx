import { useState, useEffect } from 'react';
import { User, Mail, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/supabase/client';

const API_BASE_URL = import.meta.env.VITE_GEONTRY_BACKEND || 'http://localhost:3000';

export default function Profile() {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializar con los datos actuales
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setIsLoading(false);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) return;
    
    setIsSaving(true);
    try {
      // 1. Update in the backend (Postgres profiles table)
      const response = await fetch(`${API_BASE_URL}/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil en el servidor');
      }

      // 2. Update Supabase Auth user metadata so it instantly reflects in the sidebar
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Tu nombre ha sido actualizado correctamente.",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al guardar.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-geo-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
          <p className="text-geo-text-muted">Administra tu información personal</p>
        </div>
      </div>

      <Card className="bg-geo-gray border-geo-gray-light">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-geo-blue" />
            Información Personal
          </CardTitle>
          <CardDescription className="text-geo-text-muted">
            Actualiza tu nombre y visualiza la información de tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-geo-text-muted" />
                  Correo Electrónico (Solo Lectura)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-geo-darker/50 border-geo-gray-light text-geo-text-muted cursor-not-allowed"
                />
                <p className="text-xs text-geo-text-muted mt-1">
                  El correo no se puede cambiar ya que está vinculado a tu cuenta principal.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-geo-text-muted" />
                  Nombre Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-geo-darker border-geo-gray-light text-white focus:border-geo-blue"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-geo-gray-light">
              <Button 
                type="submit" 
                className="bg-geo-blue hover:bg-geo-blue-dark text-white font-medium"
                disabled={isSaving || fullName === user?.user_metadata?.full_name}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
