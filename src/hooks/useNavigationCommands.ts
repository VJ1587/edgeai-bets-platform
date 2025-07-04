
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationService } from '@/services/navigationService';

export const useNavigationCommands = () => {
  const navigate = useNavigate();

  useEffect(() => {
    NavigationService.setNavigate(navigate);
  }, [navigate]);

  return {
    navigateHome: NavigationService.navigateHome,
    navigateChallenges: NavigationService.navigateChallenges,
    navigateArena: NavigationService.navigateArena,
    navigateWallet: NavigationService.navigateWallet,
    navigateProfile: NavigationService.navigateProfile,
    startBet: NavigationService.startBet,
    joinSyndicate: NavigationService.joinSyndicate,
    openEliteMatch: NavigationService.openEliteMatch,
    launchBookieConsole: NavigationService.launchBookieConsole,
    launchGameBet: NavigationService.launchGameBet,
    returnToHome: NavigationService.returnToHome,
    goBack: NavigationService.goBack,
  };
};
