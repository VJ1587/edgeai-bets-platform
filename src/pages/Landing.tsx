
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, Users, BarChart3, Zap, Globe, DollarSign, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <Badge className="mb-6 bg-green-500/10 text-green-400 border-green-500/20 text-xs sm:text-sm">
            $245B+ Global Sports Betting Market
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            EdgeStake<span className="text-blue-400">.ai</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4">
            Smart Sports Betting Platform
          </p>
          
          <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Mobile-first platform for sports betting, 1v1 challenges, syndicate wagers, and data-driven risk intelligence. 
            Blending gambling entertainment with structured financial discipline.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 w-full sm:w-auto">
              Join the Waitlist
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-6 sm:px-8 py-3 w-full sm:w-auto">
              Request Investor Deck
            </Button>
          </div>
        </div>
      </div>

      {/* Market Opportunity Banner */}
      <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border-y border-green-500/20 py-12 sm:py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">
            Behavioral Liquidity Engine
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Leveraging advanced analytics and user behavior patterns to create deeper market liquidity 
            and smarter betting opportunities in the $245B+ global sports betting ecosystem.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
          Platform Features
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-4 sm:p-6 text-center">
              <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Data-Driven Odds</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Real-time odds powered by advanced analytics and market intelligence
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-4 sm:p-6 text-center">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Secure Wallet + Escrow</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Bank-grade security with automated escrow for all transactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-4 sm:p-6 text-center">
              <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-purple-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Margin Protection</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Advanced risk management and margin protection systems
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-4 sm:p-6 text-center">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-orange-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Syndicate/Group Play</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Team up with other bettors for larger stakes and shared risk
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue Streams */}
      <div className="bg-slate-800/30 py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
            Revenue Streams
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-600/20 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Subscription</h3>
              <p className="text-xs sm:text-sm text-gray-400">Monthly tiers: Free, Pro, Elite</p>
            </div>

            <div className="text-center">
              <div className="bg-green-600/20 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Per-Bet Fee</h3>
              <p className="text-xs sm:text-sm text-gray-400">Commission on each wager placed</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Data Monetization</h3>
              <p className="text-xs sm:text-sm text-gray-400">Insights and analytics licensing</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600/20 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Escrow Margin</h3>
              <p className="text-xs sm:text-sm text-gray-400">Market maker spread revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
          Enterprise Architecture
        </h2>
        
        <div className="max-w-5xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
                <div>
                  <div className="bg-green-600/20 rounded-lg p-3 sm:p-4 mb-3">
                    <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto" />
                  </div>
                  <h4 className="text-sm sm:text-base text-white font-semibold">Supabase</h4>
                  <p className="text-xs text-gray-400">Database & Auth</p>
                </div>
                
                <div>
                  <div className="bg-blue-600/20 rounded-lg p-3 sm:p-4 mb-3">
                    <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto" />
                  </div>
                  <h4 className="text-sm sm:text-base text-white font-semibold">Stripe</h4>
                  <p className="text-xs text-gray-400">Payments</p>
                </div>
                
                <div>
                  <div className="bg-purple-600/20 rounded-lg p-3 sm:p-4 mb-3">
                    <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mx-auto" />
                  </div>
                  <h4 className="text-sm sm:text-base text-white font-semibold">OddsAPI</h4>
                  <p className="text-xs text-gray-400">Live Data</p>
                </div>
                
                <div>
                  <div className="bg-orange-600/20 rounded-lg p-3 sm:p-4 mb-3">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400 mx-auto" />
                  </div>
                  <h4 className="text-sm sm:text-base text-white font-semibold">Payout Engine</h4>
                  <p className="text-xs text-gray-400">Automated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Get Started?
          </h2>
          
          <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of smart bettors already using EdgeStake.ai to make data-driven decisions and maximize their wins.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 w-full sm:w-auto">
                Join Now - Start Betting
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-6 sm:px-8 py-3 w-full sm:w-auto">
              Book Investor Call
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2025 EdgeStake.ai - Smart Sports Betting Platform</p>
          <p className="mt-2 text-xs sm:text-sm">Licensed and regulated for responsible gaming</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
