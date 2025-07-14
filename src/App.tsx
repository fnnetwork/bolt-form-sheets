import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useUsers } from './hooks/useUsers';
import EmailForm from './components/Auth/EmailForm';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import Home from './components/Dashboard/Home';
import StadiumMap from './components/Stadium/StadiumMap';
import SectorSelection from './components/Stadium/SectorSelection';
import CommunityFeed from './components/Community/CommunityFeed';

const AppContent: React.FC = () => {
  const { user, isLoading, updateUser } = useAuth();
  const { users, loading: usersLoading, refresh: refreshUsers } = useUsers();
  const [authStep, setAuthStep] = useState<'email' | 'login' | 'register'>('email');
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentView, setCurrentView] = useState('home');
  const [showSectorSelection, setShowSectorSelection] = useState(false);

  // Debug: Log users whenever they change
  useEffect(() => {
    console.log('🏠 App received users update:', users.length, 'users');
    if (users.length > 0) {
      console.log('📋 Current users:', users.map(u => ({ id: u.id, name: u.name, sector: u.sector })));
    }
  }, [users]);

  useEffect(() => {
    if (user && !user.sector && currentView === 'map') {
      setShowSectorSelection(true);
    } else {
      setShowSectorSelection(false);
    }
  }, [user, currentView]);

  const handleEmailSubmit = async (email: string, isExistingUser: boolean) => {
    setCurrentEmail(email);
    setAuthStep(isExistingUser ? 'login' : 'register');
  };

  const handleBackToEmail = () => {
    setAuthStep('email');
    setCurrentEmail('');
  };

  const handleSectorUpdate = () => {
    setShowSectorSelection(false);
    setCurrentView('map');
    // Refresh users to ensure we have the latest data
    refreshUsers();
  };

  // NEW: Handle sector selection from map
  const handleSectorSelect = async (sectorCode: string) => {
    console.log('🗺️ Map sector selected:', sectorCode);
    
    if (user) {
      try {
        // Update user's sector in database
        const success = await updateUser({ sector: sectorCode });
        
        if (success) {
          console.log('✅ Sector saved successfully:', sectorCode);
          // Refresh users to ensure real-time sync
          setTimeout(() => {
            refreshUsers();
          }, 1000);
        } else {
          console.error('❌ Failed to save sector');
        }
        
        // Show success message or redirect
        // The map component will handle the confirmation UI
      } catch (error) {
        console.error('❌ Error saving sector:', error);
      }
    }
  };

  if (isLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full animate-spin mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    switch (authStep) {
      case 'email':
        return <EmailForm onEmailSubmit={handleEmailSubmit} />;
      case 'login':
        return <LoginForm email={currentEmail} onBack={handleBackToEmail} />;
      case 'register':
        return <RegisterForm email={currentEmail} onBack={handleBackToEmail} />;
      default:
        return <EmailForm onEmailSubmit={handleEmailSubmit} />;
    }
  }

  const renderContent = () => {
    if (showSectorSelection) {
      return (
        <div className="max-w-2xl mx-auto">
          <SectorSelection 
            users={users} 
            onSectorUpdate={handleSectorUpdate}
          />
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return <Home users={users} onViewChange={setCurrentView} currentView={currentView} />;
      case 'map':
        return (
          <StadiumMap
            onSectorSelect={handleSectorSelect}
            users={users}
            selectedSector={user.sector}
          />
        );
      case 'community':
        return <CommunityFeed users={users} />;
      default:
        return <Home users={users} onViewChange={setCurrentView} currentView={currentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        totalUsers={users.length}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;