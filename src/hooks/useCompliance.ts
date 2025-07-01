
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type UserConsentLog = Database['public']['Tables']['user_consent_log']['Row'];
type UserEvent = Database['public']['Tables']['user_events']['Row'];

export const useCompliance = () => {
  const { user } = useAuth();
  const [consentLogs, setConsentLogs] = useState<UserConsentLog[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchConsentLogs();
    fetchUserEvents();
  }, [user]);

  const fetchConsentLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_consent_log')
        .select('*')
        .eq('user_id', user.id)
        .order('consent_timestamp', { ascending: false });

      if (error) throw error;
      setConsentLogs(data || []);
    } catch (err) {
      console.error('Error fetching consent logs:', err);
      setConsentLogs([]);
    }
  };

  const fetchUserEvents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setUserEvents(data || []);
    } catch (err) {
      console.error('Error fetching user events:', err);
      setUserEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const logConsent = async (
    consentType: 'gdpr' | 'ccpa' | 'terms' | 'privacy',
    consentGiven: boolean,
    version?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_consent_log')
        .insert({
          user_id: user.id,
          consent_type: consentType,
          consent_given: consentGiven,
          ip_address: await getUserIP(),
          user_agent: navigator.userAgent,
          version: version
        });

      if (error) throw error;
      await fetchConsentLogs();
    } catch (err) {
      console.error('Error logging consent:', err);
      throw err;
    }
  };

  const logUserEvent = async (
    eventType: string,
    eventData?: any
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('log_user_event', {
        p_user_id: user.id,
        p_event_type: eventType,
        p_event_data: eventData ? JSON.stringify(eventData) : null,
        p_ip_address: await getUserIP(),
        p_user_agent: navigator.userAgent
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error logging user event:', err);
    }
  };

  const getUserIP = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  };

  const hasValidConsent = (consentType: 'gdpr' | 'ccpa' | 'terms' | 'privacy'): boolean => {
    const latestConsent = consentLogs.find(log => 
      log.consent_type === consentType && log.consent_given
    );
    return !!latestConsent;
  };

  return {
    consentLogs,
    userEvents,
    loading,
    logConsent,
    logUserEvent,
    hasValidConsent,
    refetch: () => {
      fetchConsentLogs();
      fetchUserEvents();
    }
  };
};
