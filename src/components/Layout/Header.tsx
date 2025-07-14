import React from 'react';
import { LogOut, Users, MapPin, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  totalUsers: number;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, totalUsers }) => {
  const { user, logout } = useAuth();

  return (
    <header className="text-white shadow-2xl" style={{ background: 'linear-gradient(to right, #de2828, #b91c1c, #991b1b)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-16 h-10 flex items-center justify-center">
                <img 
                  src="/SemTag_08.png" 
                  alt="Zona Neutra" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold">A+BDB no SP Game!</h1>
                {/* Removido: Zona Neutra NFL São Paulo */}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4" />
            <span className="font-semibold">{totalUsers} fãs confirmados!</span>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-1">
              <button
                onClick={() => onViewChange('home')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  currentView === 'home'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-red-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Início</span>
              </button>
              <button
                onClick={() => onViewChange('map')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  currentView === 'map'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-red-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Mapa</span>
              </button>
              <button
                onClick={() => onViewChange('community')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  currentView === 'community'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-red-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Comunidade</span>
              </button>
            </nav>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-medium text-sm">{user?.name}</p>
                {/* Removido: setor do usuário no mobile */}
                {user?.sector && (
                  <p className="text-xs text-red-200 hidden md:block">
                    {user.sector.includes('-') 
                      ? `${user.sector.split('-')[0]} - ${user.sector.split('-')[1]} - ${user.sector.split('-')[2] || ''}`
                      : `Setor ${user.sector}`
                    }
                  </p>
                )}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/20">
        <div className="flex">
          <button
            onClick={() => onViewChange('home')}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              currentView === 'home'
                ? 'bg-white/20 text-white'
                : 'text-red-100 hover:bg-white/10'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => onViewChange('map')}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              currentView === 'map'
                ? 'bg-white/20 text-white'
                : 'text-red-100 hover:bg-white/10'
            }`}
          >
            Mapa
          </button>
          <button
            onClick={() => onViewChange('community')}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              currentView === 'community'
                ? 'bg-white/20 text-white'
                : 'text-red-100 hover:bg-white/10'
            }`}
          >
            Comunidade
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;