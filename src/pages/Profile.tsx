
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Crown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="text-red-500 border-red-500/20 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {getInitials(userProfile?.full_name || user?.email || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{userProfile?.full_name || 'User'}</h2>
                <p className="text-muted-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge 
                variant="secondary" 
                className="text-primary capitalize flex items-center"
              >
                <Crown className="h-3 w-3 mr-1" />
                {userProfile?.plan_type || 'free'} Plan
              </Badge>
              <Badge 
                variant={userProfile?.subscription_status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {userProfile?.subscription_status || 'inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/10 flex items-center justify-center">
                <User className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-lg font-bold">
                {new Date(userProfile?.created_at || Date.now()).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">Member Since</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <p className="text-lg font-bold capitalize">{userProfile?.plan_type || 'Free'}</p>
              <p className="text-xs text-muted-foreground">Current Plan</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-3" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Crown className="h-4 w-4 mr-3" />
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
