import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, User, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/supabase/supabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_GEONTRY_BACKEND || 'http://localhost:3000';

type HouseholdMember = Database['public']['Tables']['household_members']['Row'] & {
  profiles: { full_name: string; email: string; avatar_url: string | null } | null;
  households: { name: string } | null;
};

export default function Family() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [householdName, setHouseholdName] = useState<string>('Mi Hogar');
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('FAMILY');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFamilyMembers();
  }, [session]);

  const fetchFamilyMembers = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/households/user/${session.user.id}/members`);
      if (!response.ok) {
        throw new Error('Error al obtener los miembros del hogar');
      }

      const data = await response.json();
      
      setHouseholdId(data.household_id);
      setHouseholdName(data.household_name || 'Mi Hogar');
      setMembers(data.members || []);
      
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdId || !inviteEmail) return;

    setIsInviting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/households/${householdId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al invitar familiar');
      }

      toast({
        title: "Éxito",
        description: "Familiar invitado correctamente al hogar.",
      });

      setIsModalOpen(false);
      setInviteEmail('');
      fetchFamilyMembers(); // Refrescar lista
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const getRoleBadge = (role: string | null) => {
    switch(role) {
      case 'OWNER':
        return <span className="px-2 py-1 bg-geo-blue/20 text-geo-blue text-xs rounded-full flex items-center gap-1"><Shield className="w-3 h-3" /> Propietario</span>;
      case 'FAMILY':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Familiar</span>;
      case 'GUEST':
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">Invitado</span>;
      default:
        return null;
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-geo-blue" />
            Familia y Permisos
          </h1>
          <p className="text-geo-text-muted">Gestiona el acceso de tu familia a {householdName}</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-geo-blue hover:bg-geo-blue-dark text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Invitar Familiar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-geo-gray border-geo-gray-light text-white">
            <DialogHeader>
              <DialogTitle>Invitar al Hogar</DialogTitle>
              <DialogDescription className="text-geo-text-muted">
                Ingresa el correo electrónico del usuario. Debe haber creado una cuenta en GeoEntry previamente.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="familiar@ejemplo.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="bg-geo-darker border-geo-gray-light text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="bg-geo-darker border-geo-gray-light text-white">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent className="bg-geo-gray border-geo-gray-light text-white">
                      <SelectItem value="FAMILY">Familiar</SelectItem>
                      <SelectItem value="GUEST">Invitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isInviting} className="bg-geo-blue hover:bg-geo-blue-dark">
                  {isInviting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Invitar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-geo-gray border-geo-gray-light">
        <CardHeader>
          <CardTitle className="text-white">Miembros del Hogar</CardTitle>
          <CardDescription className="text-geo-text-muted">
            Personas con acceso para controlar los dispositivos y seguridad de la casa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8 text-geo-text-muted">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Aún no hay miembros registrados en este hogar.</p>
              <p className="text-sm mt-1">Invita a alguien para compartir el acceso.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-geo-darker border border-geo-gray-light">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-geo-blue/20 flex items-center justify-center text-geo-blue">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{member.profiles?.full_name || 'Usuario'} {member.profile_id === session?.user?.id && '(Tú)'}</h3>
                      <p className="text-sm text-geo-text-muted">{member.profiles?.email}</p>
                    </div>
                  </div>
                  <div>
                    {getRoleBadge(member.role)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-geo-gray border-geo-gray-light border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <Shield className="w-10 h-10 text-yellow-500/50" />
            <h3 className="text-lg font-medium text-white">Gestión Centralizada</h3>
            <p className="text-geo-text-muted max-w-md">
              Para mayor seguridad, los permisos y alertas críticas se administran exclusivamente desde este panel web.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
