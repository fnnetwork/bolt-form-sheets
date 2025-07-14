import React, { useState } from 'react';
import { MessageCircle, Clock, Star, Users, Calendar } from 'lucide-react';
import { GAME_INFO } from '../../data/stadiumData';
import { CommunityPost, User } from '../../types';

interface CommunityFeedProps {
  users: User[];
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ users }) => {
  const [posts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Zona Neutra',
      content: 'Fala, A+BDB! 🏈 O grande dia está chegando! Chargers vs Chiefs em São Paulo será histórico. Não esqueçam de cadastrar seus setores aqui no mapa para encontrarmos toda a galera!',
      timestamp: new Date('2025-08-20T10:00:00'),
      isOfficial: true
    },
    {
      id: '2',
      author: 'Zona Neutra',
      content: 'DICA IMPORTANTE: Cheguem cedo no estádio! As filas podem ser grandes e vocês não querem perder nem um segundo desse jogo épico. Vamos representar a A+BDB! ❤️🖤',
      timestamp: new Date('2025-08-25T15:30:00'),
      isOfficial: true
    },
    {
      id: '3',
      author: 'Zona Neutra',
      content: 'Já temos mais de 100 fãs cadastrados no mapa! Isso é incrível! Continue espalhando para os amigos da A+BDB que também vão ao jogo. #ZonaNeutraNoNFL',
      timestamp: new Date('2025-08-30T09:15:00'),
      isOfficial: true
    }
  ]);

  // Calculate time until game
  const now = new Date();
  const timeUntilGame = GAME_INFO.date.getTime() - now.getTime();
  const daysUntilGame = Math.max(0, Math.ceil(timeUntilGame / (1000 * 60 * 60 * 24)));
  const hoursUntilGame = Math.max(0, Math.floor((timeUntilGame % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutesUntilGame = Math.max(0, Math.floor((timeUntilGame % (1000 * 60 * 60)) / (1000 * 60)));

  const formatTimestamp = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Game Countdown */}
      <div className="rounded-2xl shadow-xl p-6 text-white" style={{ background: 'linear-gradient(to right, #de2828, #b91c1c, #991b1b)' }}>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Contagem Regressiva</h2>
          <p className="text-red-100 mb-6">Para o jogo mais esperado do ano!</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-3xl font-bold">{daysUntilGame}</div>
              <div className="text-sm text-red-100">Dias</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-3xl font-bold">{hoursUntilGame}</div>
              <div className="text-sm text-red-100">Horas</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-3xl font-bold">{minutesUntilGame}</div>
              <div className="text-sm text-red-100">Minutos</div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-semibold">05 de Setembro de 2025 • 21:20</span>
            </div>
            <p className="text-lg font-bold">{GAME_INFO.teams.away} vs {GAME_INFO.teams.home}</p>
            <p className="text-red-100">{GAME_INFO.stadium}, {GAME_INFO.city}</p>
          </div>
        </div>
      </div>

      {/* Community Stats - SIMPLIFICADO */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Estatísticas da A+BDB</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#de2828' }} />
            <div className="text-2xl font-bold" style={{ color: '#de2828' }}>{users.length}</div>
            <div className="text-sm" style={{ color: '#b91c1c' }}>Fãs Cadastrados</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">
              {users.filter(u => u.sector).length}
            </div>
            <div className="text-sm text-green-600">Com Setor Definido</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-900">{daysUntilGame}</div>
            <div className="text-sm text-orange-600">Dias Restantes</div>
          </div>
        </div>
      </div>

      {/* Official Posts */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2" style={{ color: '#de2828' }} />
          Recados Oficiais
        </h3>
        
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`p-4 rounded-xl border-l-4 ${
                post.isOfficial
                  ? 'bg-red-50'
                  : 'bg-gray-50 border-gray-300'
              }`}
              style={post.isOfficial ? { borderLeftColor: '#de2828' } : {}}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center mr-3 p-1 shadow-sm">
                    <img 
                      src="/SemTag_08.png" 
                      alt="Zona Neutra" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    {post.isOfficial && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        <Star className="w-3 h-3 mr-1" />
                        Oficial
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(post.timestamp)}
                </span>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6" style={{ borderColor: '#de2828', borderWidth: '1px' }}>
        <h4 className="text-lg font-bold text-gray-900 mb-2">
          🔥 Vamos fazer história juntos!
        </h4>
        <p className="text-gray-700 mb-4">
          Este será o primeiro jogo da NFL no Brasil! Vamos mostrar que a A+BDB é a audiência mais bonita e animada do mundo. 
          Não esqueçam de usar #ZonaNeutraNoNFL nas redes sociais!
        </p>
        <div className="bg-white rounded-lg p-3">
          <p className="text-sm text-gray-600 font-medium">
            💡 Dica: Usem as hashtags #ZonaNeutra #ABDB #NFLBrasil nas suas fotos no estádio!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;