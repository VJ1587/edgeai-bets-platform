import { NavigateFunction } from 'react-router-dom';

export class NavigationService {
  private static navigate: NavigateFunction | null = null;

  static setNavigate(navigateFunction: NavigateFunction) {
    this.navigate = navigateFunction;
  }

  // Global Navigation Commands
  static navigateHome() {
    this.navigate?.('/');
  }

  static navigateChallenges() {
    this.navigate?.('/challenges');
  }

  static navigateArena() {
    this.navigate?.('/arena');
  }

  static navigateWallet() {
    this.navigate?.('/wallet');
  }

  static navigateProfile() {
    this.navigate?.('/profile');
  }

  // Enhanced Bet Flow Commands
  static startBet(type: '1v1' | 'syndicate' | 'kingmaker' | 'game') {
    switch (type) {
      case '1v1':
        this.navigate?.('/challenges?type=duel');
        break;
      case 'syndicate':
        this.navigate?.('/challenges?type=arena');
        break;
      case 'kingmaker':
        this.navigate?.('/arena?mode=kingmaker');
        break;
      case 'game':
        this.navigate?.('/bet-simulation');
        break;
    }
  }

  static joinSyndicate(syndicateId?: string) {
    const path = syndicateId 
      ? `/challenges?join=${syndicateId}` 
      : '/challenges?tab=groups';
    this.navigate?.(path);
  }

  static openEliteMatch() {
    this.navigate?.('/arena?tier=elite');
  }

  static launchBookieConsole() {
    this.navigate?.('/bookie-hub');
  }

  static launchGameBet(gameType?: string) {
    const path = gameType 
      ? `/bet-simulation?type=${gameType}` 
      : '/bet-simulation';
    this.navigate?.(path);
  }

  static enterThePit() {
    this.navigate?.('/lines?market=open');
  }

  static openKingmakerChallenge() {
    this.navigate?.('/arena?challenge=kingmaker');
  }

  // Quick Action Commands
  static quickDuel(amount?: number) {
    const path = amount 
      ? `/challenges?quick=duel&amount=${amount}` 
      : '/challenges?quick=duel';
    this.navigate?.(path);
  }

  static quickSyndicate(sport?: string) {
    const path = sport 
      ? `/challenges?tab=groups&sport=${sport}` 
      : '/challenges?tab=groups';
    this.navigate?.(path);
  }

  // Return navigation
  static returnToHome() {
    this.navigate?.('/');
  }

  static goBack() {
    window.history.back();
  }
}

// Bet state management
export interface BetState {
  eventId?: string;
  teamId?: string;
  amount?: number;
  betType?: string;
  locked?: boolean;
  matchId?: string;
}

export class BetStateManager {
  private static state: BetState = {};

  static setState(newState: Partial<BetState>) {
    this.state = { ...this.state, ...newState };
  }

  static getState(): BetState {
    return { ...this.state };
  }

  static clearState() {
    this.state = {};
  }

  // King's Duel Flow Commands
  static selectEvent(eventId: string) {
    this.setState({ eventId });
  }

  static chooseSide(teamId: string) {
    this.setState({ teamId });
  }

  static setWager(amount: number) {
    this.setState({ amount });
  }

  static lockBet() {
    this.setState({ locked: true });
  }

  static confirmMatch() {
    // Implementation for match confirmation
    console.log('Match confirmed with state:', this.getState());
  }

  // Arena Flow Commands
  static openSyndicate(matchId: string) {
    this.setState({ matchId, betType: 'syndicate' });
  }

  static stake(amount: number) {
    this.setState({ amount });
  }

  static confirmEntry() {
    console.log('Entry confirmed for syndicate:', this.getState());
  }
}
