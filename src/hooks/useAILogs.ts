import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AIInferenceLog {
  id: string;
  user_id: string;
  proximity_event_id: string | null;
  context_snapshot: any;
  ai_confidence: number | null;
  raw_prompt: string;
  ai_response: any;
  created_at: string;
  proximity_event?: {
    type: string;
    home_location_name: string;
  };
}

export const useAILogs = () => {
  const { session } = useAuth();

  const fetchAILogs = async (): Promise<AIInferenceLog[]> => {
    if (!session?.user?.id) {
      throw new Error('No hay sesión activa');
    }

    const { data, error } = await supabase
      .from('ai_inference_logs')
      .select(`
        *,
        proximity_event:proximity_events(type, home_location_name)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching AI logs: ${error.message}`);
    }

    return data as any[];
  };

  return useQuery({
    queryKey: ['ai-logs', session?.user?.id],
    queryFn: fetchAILogs,
    enabled: !!session?.user?.id,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
};
