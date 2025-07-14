import React from 'react';
import { MapPin, Users, Calendar, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GAME_INFO } from '../../data/stadiumData';
import { User } from '../../types';

interface HomeProps {
  users: User[];
  onViewChange: (view: string) => void;
  currentView: string;
}

const Home: React.FC<HomeProps> = ({ users, onViewChange, currentView }) => {
  const { user } = useAuth();
  
  // Game countdown
  const now = new Date();
  const timeUntilGame = GAME_INFO.date.getTime() - now.getTime();
  const daysUntilGame = Math.max(0, Math.ceil(timeUntilGame / (1000 * 60 * 60 * 24)));
  const hoursUntilGame = Math.max(0, Math.floor((timeUntilGame % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutesUntilGame = Math.max(0, Math.floor((timeUntilGame % (1000 * 60 * 60)) / (1000 * 60)));

  const formatUserSector = (sector: string) => {
    if (sector.includes('-')) {
      const parts = sector.split('-');
      return `${parts[0]} - ${parts[1]}${parts[2] ? ` - ${parts[2]}` : ''}`;
    }
    return `Setor ${sector}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero - NOVA ESTRUTURA */}
      <div className="rounded-2xl shadow-2xl text-white overflow-hidden" style={{ background: 'linear-gradient(to right, #de2828, #b91c1c, #991b1b)' }}>
        <div className="p-8">
          {/* Título Principal */}
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight">
              A+BDB<br />
              no SP Game
            </h1>
            <p className="text-red-200 text-lg mb-4">
              Faltam {daysUntilGame} dias para nosso encontro!
            </p>
            <p className="text-red-100 text-xl mb-2">
              Bem-vindo(a), {user?.name}! 👋
            </p>
            <p className="text-red-200 text-lg">
              Pronto(a) para ver Mahomes?
            </p>
          </div>

          {/* Countdown */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center bg-white/10 rounded-xl p-4">
              <div className="text-4xl font-bold mb-1">{daysUntilGame}</div>
              <div className="text-red-200 text-sm">DIAS</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4">
              <div className="text-4xl font-bold mb-1">{hoursUntilGame}</div>
              <div className="text-red-200 text-sm">HORAS</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4">
              <div className="text-4xl font-bold mb-1">{minutesUntilGame}</div>
              <div className="text-red-200 text-sm">MINUTOS</div>
            </div>
          </div>

          {/* Eventos */}
          <div className="space-y-4">
            {/* Encontro da A+BDB */}
            <div className="bg-white/10 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-10 flex items-center justify-center mr-4">
                  <img 
                    src="/SemTag_08.png" 
                    alt="Zona Neutra" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-1">Encontro da A+BDB!</h3>
                  <p className="text-red-200">Kickoff da temporada</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">4 de setembro de 2025</p>
                <p className="text-red-200">Detalhes em breve!</p>
              </div>
            </div>

            {/* Jogo NFL */}
            <div className="bg-white/10 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-4">
                  {/* Logo Chiefs */}
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">KC</span>
                  </div>
                  
                  <span className="text-2xl font-bold">@</span>
                  
                  {/* Logo Chargers */}
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">LAC</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold mb-1">{GAME_INFO.teams.away} vs {GAME_INFO.teams.home}</p>
                <p className="text-xl font-semibold mb-1">5 de setembro de 2025</p>
                <p className="text-red-200">21h20 | Arena Corinthians</p>
              </div>
            </div>
          </div>

          {/* Ação necessária - apenas se não tiver setor */}
          {!user?.sector && (
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 mt-6">
              <p className="font-semibold mb-2">⚠️ Ação necessária</p>
              <p className="text-sm text-yellow-100 mb-3">
                Você ainda não informou sua localização no estádio. Cadastre agora para encontrar outros fãs da A+BDB!
              </p>
              <button
                onClick={() => onViewChange('map')}
                className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Selecionar Localização
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Cards - SIMPLIFICADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onViewChange('map')}
          className="bg-white rounded-2xl shadow-xl p-6 text-left hover:shadow-2xl transition-shadow duration-300 group"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200" style={{ background: 'linear-gradient(to bottom right, #de2828, #b91c1c)' }}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 transition-colors" style={{ color: currentView === 'map' ? '#de2828' : '' }}>
                Explorar Mapa
              </h3>
              <p className="text-gray-600">Veja o mapa interativo do estádio</p>
            </div>
          </div>
          <p className="text-gray-700">
            {user?.sector 
              ? `Você está em: ${formatUserSector(user.sector)}. Veja quem mais estará por perto!`
              : 'Selecione sua localização e encontre outros fãs da A+BDB'
            }
          </p>
        </button>

        <button
          onClick={() => onViewChange('community')}
          className="bg-white rounded-2xl shadow-xl p-6 text-left hover:shadow-2xl transition-shadow duration-300 group"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                Comunidade A+BDB
              </h3>
              <p className="text-gray-600">Conecte-se com outros fãs</p>
            </div>
          </div>
          <p className="text-gray-700">
            Veja as últimas novidades, contador regressivo e estatísticas da comunidade.
          </p>
        </button>
      </div>
    </div>
  );
};

export default Home;