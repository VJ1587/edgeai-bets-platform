
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookieData } from './bookie/useBookieData';
import { useBookieActions } from './bookie/useBookieActions';
import type { ApplyForLicenseData, CreateLineData, CreateSyndicateData } from './bookie/types';

export const useBookieOperator = () => {
  const { user } = useAuth();
  const { state, fetchBookieData, refetchLines, refetchSyndicates } = useBookieData();
  const { applyForLicense: applyForLicenseAction, createLine: createLineAction, createSyndicate: createSyndicateAction } = useBookieActions();

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchBookieData(user.id);
  }, [user, fetchBookieData]);

  const applyForLicense = async (applicationData: ApplyForLicenseData) => {
    if (!user) throw new Error('User not authenticated');
    const data = await applyForLicenseAction(user.id, applicationData);
    await fetchBookieData(user.id); // Refresh data
    return data;
  };

  const createLine = async (lineData: CreateLineData) => {
    if (!state.operator) throw new Error('No bookie operator found');
    const data = await createLineAction(state.operator, lineData);
    await refetchLines(state.operator.id);
    return data;
  };

  const createSyndicate = async (syndicateData: CreateSyndicateData) => {
    if (!state.operator) throw new Error('No bookie operator found');
    const data = await createSyndicateAction(state.operator, syndicateData);
    await refetchSyndicates(state.operator.id);
    return data;
  };

  return {
    operator: state.operator,
    lines: state.lines,
    syndicates: state.syndicates,
    transactions: state.transactions,
    loading: state.loading,
    error: state.error,
    isBookieOperator: !!state.operator && state.operator.status === 'active',
    applyForLicense,
    createLine,
    createSyndicate,
    refetch: () => user ? fetchBookieData(user.id) : Promise.resolve(),
  };
};
