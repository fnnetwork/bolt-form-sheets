import React, { useState } from 'react';
import { Users, MapPin, ChevronDown, Eye, ChevronUp, CheckCircle } from 'lucide-react';
import { MAIN_SECTORS, STADIUM_SECTORS } from '../../data/stadiumData';
import { User } from '../../types';
import UsersBySector from '../Community/UsersBySector';

interface StadiumMapProps {
  onSectorSelect: (sectorCode: string) => void;
  users: User[];
  selectedSector?: string;
}

const StadiumMap: React.FC<StadiumMapProps> = ({ onSectorSelect, users, selectedSector }) => {
  const [selectedMainSector, setSelectedMainSector] = useState<string | null>(null);
  const [selectedSectorNumber, setSelectedSectorNumber] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [viewingUsers, setViewingUsers] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMainSectorClick = (sectorName: string) => {
    if (selectedMainSector === sectorName) {
      // Se já está selecionado, fecha o dropdown
      setSelectedMainSector(null);
      setSelectedSectorNumber('');
      setSelectedRow('');
    } else {
      // Abre o dropdown para o setor clicado
      setSelectedMainSector(sectorName);
      setSelectedSectorNumber('');
      setSelectedRow('');
    }
  };

  const handleConfirmSelection = async () => {
    if (selectedMainSector && selectedSectorNumber && selectedRow && !isUpdating) {
      const fullSectorCode = `${selectedMainSector}-${selectedSectorNumber}-${selectedRow}`;
      
      console.log('🗺️ Confirming sector selection:', fullSectorCode);
      setIsUpdating(true);
      
      // Mostrar confirmação
      setShowConfirmation(true);
      
      try {
        // Chamar a função de seleção (que agora salva no banco)
        await onSectorSelect(fullSectorCode);
        
        console.log('✅ Sector selection confirmed and saved');
        
        // Limpar seleção após sucesso
        setTimeout(() => {
          setSelectedMainSector(null);
          setSelectedSectorNumber('');
          setSelectedRow('');
          setShowConfirmation(false);
          setIsUpdating(false);
        }, 3000);
        
      } catch (error) {
        console.error('❌ Error confirming sector selection:', error);
        setShowConfirmation(false);
        setIsUpdating(false);
      }
    }
  };

  const getSectorFanCount = (mainSector: string) => {
    return users.filter(user => user.sector?.startsWith(mainSector)).length;
  };

  const getSectorNumberFanCount = (mainSector: string, sectorNumber: string) => {
    return users.filter(user => user.sector?.startsWith(`${mainSector}-${sectorNumber}`)).length;
  };

  const getUsersInSector = (mainSector: string, sectorNumber: string) => {
    return users.filter(user => user.sector?.startsWith(`${mainSector}-${sectorNumber}`));
  };

  const getSectorColor = (sector: any) => {
    if (selectedMainSector === sector.name) return 'rgba(222, 40, 40, 0.8)';
    if (hoveredSector === sector.name) return 'rgba(245, 158, 11, 0.8)';
    return 'rgba(59, 130, 246, 0.6)';
  };

  const validateRowInput = (value: string) => {
    // Permite apenas letras e números, máximo 4 caracteres (1 letra + 3 números)
    const regex = /^[A-Za-z]?[0-9]{0,3}$/;
    return regex.test(value) && value.length <= 4;
  };

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (validateRowInput(value) || value === '') {
      setSelectedRow(value);
    }
  };

  const formatUserSector = (sector: string) => {
    if (sector.includes('-')) {
      const parts = sector.split('-');
      return `${parts[0]} - ${parts[1]} - ${parts[2] || ''}`;
    }
    return `Setor ${sector}`;
  };

  // Calculate top sectors for the popular sectors section
  const sectorStats = users.filter(u => u.sector).reduce((acc, user) => {
    if (user.sector) {
      const parts = user.sector.split('-');
      const sectorKey = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : user.sector;
      acc[sectorKey] = (acc[sectorKey] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topSectors = Object.entries(sectorStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stadium Map */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Encontre a A+BDB na Arena!</h2>
          <p className="text-gray-600 mb-4">
            Clique em um lado do estádio para selecionar seu setor e fileira
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {MAIN_SECTORS.map((sector) => {
              const fanCount = getSectorFanCount(sector.name);
              return (
                <div key={sector.id} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{fanCount}</div>
                  <div className="text-sm text-gray-600">fãs no {sector.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stadium Map with New Background Image - MOBILE OPTIMIZED */}
        <div className="bg-gray-50 rounded-xl p-2 md:p-4 mb-6 overflow-hidden">
          <div 
            className="relative w-full mx-auto rounded-lg overflow-hidden shadow-lg"
            style={{ 
              maxWidth: '100%',
              aspectRatio: '4/3',
              backgroundImage: 'url(/MAPA-NEOQUIMICA-2.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '300px'
            }}
          >
            {/* Overlay SVG for Interactive Sectors - MOBILE RESPONSIVE */}
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full absolute inset-0"
              style={{ 
                minHeight: '300px',
                touchAction: 'manipulation'
              }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Interactive Sector Overlays - COORDENADAS AJUSTADAS PARA MOBILE */}
              {MAIN_SECTORS.map((sector) => {
                const fanCount = getSectorFanCount(sector.name);
                
                // Coordenadas ajustadas para melhor responsividade
                let adjustedCoords;
                switch(sector.name) {
                  case 'NORTE':
                    adjustedCoords = { x: 60, y: 180, width: 100, height: 240 }; // Left side - mais largo
                    break;
                  case 'LESTE':
                    adjustedCoords = { x: 160, y: 60, width: 480, height: 120 }; // Top - mais largo
                    break;
                  case 'SUL':
                    adjustedCoords = { x: 640, y: 180, width: 100, height: 240 }; // Right side - mais largo
                    break;
                  case 'OESTE':
                    adjustedCoords = { x: 160, y: 420, width: 480, height: 120 }; // Bottom - mais largo
                    break;
                  default:
                    adjustedCoords = sector.coordinates;
                }
                
                return (
                  <g key={sector.id}>
                    {/* Interactive Overlay - MELHOR PARA TOUCH */}
                    <rect
                      x={adjustedCoords.x}
                      y={adjustedCoords.y}
                      width={adjustedCoords.width}
                      height={adjustedCoords.height}
                      fill={getSectorColor(sector)}
                      stroke="rgba(255, 255, 255, 0.9)"
                      strokeWidth="4"
                      rx="16"
                      className="cursor-pointer transition-all duration-300"
                      style={{ 
                        filter: hoveredSector === sector.name ? 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'none',
                        pointerEvents: 'all'
                      }}
                      onMouseEnter={() => setHoveredSector(sector.name)}
                      onMouseLeave={() => setHoveredSector(null)}
                      onTouchStart={() => setHoveredSector(sector.name)}
                      onTouchEnd={() => setTimeout(() => setHoveredSector(null), 2000)}
                      onClick={() => handleMainSectorClick(sector.name)}
                    />
                    
                    {/* Sector Label with Background - MAIOR PARA MOBILE */}
                    <rect
                      x={adjustedCoords.x + adjustedCoords.width / 2 - 50}
                      y={adjustedCoords.y + adjustedCoords.height / 2 - 30}
                      width="100"
                      height="60"
                      fill="rgba(0, 0, 0, 0.8)"
                      rx="12"
                      className="pointer-events-none"
                    />
                    
                    <text
                      x={adjustedCoords.x + adjustedCoords.width / 2}
                      y={adjustedCoords.y + adjustedCoords.height / 2 - 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="18"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {sector.name}
                    </text>
                    
                    {/* Fan Count - MAIOR PARA MOBILE */}
                    <text
                      x={adjustedCoords.x + adjustedCoords.width / 2}
                      y={adjustedCoords.y + adjustedCoords.height / 2 + 15}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="semibold"
                      className="pointer-events-none"
                    >
                      {fanCount} fãs
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Mobile Touch Indicator */}
            <div className="absolute top-2 right-2 md:hidden bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
              Toque para selecionar
            </div>
          </div>
        </div>

        {/* Dropdown de Seleção */}
        {selectedMainSector && (
          <div className="bg-red-50 rounded-xl p-6 mb-6" style={{ borderColor: '#de2828', borderWidth: '1px' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#de2828' }}>
              Lado {selectedMainSector} Selecionado
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Dropdown de Setor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Setor
                </label>
                <div className="relative">
                  <select
                    value={selectedSectorNumber}
                    onChange={(e) => setSelectedSectorNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent appearance-none bg-white transition-all duration-200"
                    style={{ focusRingColor: '#de2828' }}
                    disabled={isUpdating}
                  >
                    <option value="">Selecione o Setor</option>
                    {STADIUM_SECTORS[selectedMainSector as keyof typeof STADIUM_SECTORS].map((sector) => {
                      const fanCount = getSectorNumberFanCount(selectedMainSector, sector.number);
                      return (
                        <option key={sector.number} value={sector.number}>
                          {sector.number} - {sector.letter} - {sector.name} ({fanCount} fãs)
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Campo de Fileira */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fileira
                </label>
                <input
                  type="text"
                  value={selectedRow}
                  onChange={handleRowChange}
                  placeholder="Ex: A100, B25, C1..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{ focusRingColor: '#de2828' }}
                  maxLength={4}
                  disabled={isUpdating}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Digite uma letra seguida de até 3 números (ex: A100)
                </p>
              </div>
            </div>

            {/* Informações do Setor Selecionado */}
            {selectedSectorNumber && (
              <div className="bg-white rounded-lg p-4 mb-4">
                {(() => {
                  const sectorInfo = STADIUM_SECTORS[selectedMainSector as keyof typeof STADIUM_SECTORS]
                    .find(s => s.number === selectedSectorNumber);
                  const fanCount = getSectorNumberFanCount(selectedMainSector, selectedSectorNumber);
                  const usersInSector = getUsersInSector(selectedMainSector, selectedSectorNumber);
                  
                  return sectorInfo ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          Setor {sectorInfo.number} - {sectorInfo.letter}
                        </h4>
                        {fanCount > 0 && (
                          <button
                            onClick={() => setViewingUsers(viewingUsers === `${selectedMainSector}-${selectedSectorNumber}` ? null : `${selectedMainSector}-${selectedSectorNumber}`)}
                            className="flex items-center px-3 py-1 text-sm rounded-lg transition-colors duration-200"
                            style={{ 
                              backgroundColor: viewingUsers === `${selectedMainSector}-${selectedSectorNumber}` ? '#de2828' : '#f3f4f6',
                              color: viewingUsers === `${selectedMainSector}-${selectedSectorNumber}` ? 'white' : '#374151'
                            }}
                            disabled={isUpdating}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {viewingUsers === `${selectedMainSector}-${selectedSectorNumber}` ? 'Ocultar' : 'Ver'} Fãs
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{sectorInfo.name}</p>
                      <div className="flex items-center" style={{ color: '#de2828' }}>
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">{fanCount} fãs da A+BDB neste setor</span>
                      </div>

                      {/* Lista de Usuários no Setor */}
                      {viewingUsers === `${selectedMainSector}-${selectedSectorNumber}` && usersInSector.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-3">Fãs confirmados neste setor:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {usersInSector.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                              >
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                  style={{ background: 'linear-gradient(to bottom right, #de2828, #b91c1c)' }}
                                >
                                  <span className="text-white font-semibold text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{user.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {formatUserSector(user.sector!)}
                                  </p>
                                  {user.bio && (
                                    <p className="text-xs text-gray-500 mt-1">{user.bio}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedMainSector(null);
                  setSelectedSectorNumber('');
                  setSelectedRow('');
                  setViewingUsers(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                disabled={isUpdating}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={!selectedSectorNumber || !selectedRow || isUpdating}
                className="flex-1 px-4 py-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center"
                style={{ backgroundColor: '#de2828' }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#c41e1e')}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#de2828')}
              >
                {isUpdating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  'Confirmar Seleção'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Mensagem de Confirmação */}
        {showConfirmation && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-green-900 mb-2">
                ✅ Localização Confirmada!
              </h3>
              <p className="text-green-700 mb-2">
                Sua localização foi salva com sucesso:
              </p>
              <p className="text-lg font-semibold text-green-800">
                {selectedMainSector} - Setor {selectedSectorNumber} - Fileira {selectedRow}
              </p>
              <p className="text-sm text-green-600 mt-2">
                Agora você pode ver outros fãs da A+BDB na sua região!
              </p>
            </div>
          </div>
        )}

        {/* Sector Info on Hover - Apenas quando não há setor selecionado */}
        {hoveredSector && !selectedMainSector && (
          <div className="bg-red-50 rounded-xl p-4" style={{ borderColor: '#de2828', borderWidth: '1px' }}>
            {(() => {
              const sector = MAIN_SECTORS.find(s => s.name === hoveredSector);
              const fanCount = getSectorFanCount(hoveredSector);
              const sectors = STADIUM_SECTORS[hoveredSector as keyof typeof STADIUM_SECTORS];
              
              return sector ? (
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: '#de2828' }}>
                    Lado {sector.name}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#b91c1c' }}>{sector.description}</p>
                  <div className="flex items-center mb-2" style={{ color: '#b91c1c' }}>
                    <Users className="w-4 h-4 mr-2" />
                    <span>{fanCount} fãs cadastrados</span>
                  </div>
                  <p className="text-xs" style={{ color: '#de2828' }}>
                    {sectors.length} setores disponíveis • Clique para selecionar
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Setores Mais Populares */}
      {topSectors.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🔥 Setores Mais Populares
          </h3>
          <div className="space-y-3">
            {topSectors.map(([sectorKey, count], index) => {
              const parts = sectorKey.split('-');
              const mainSector = parts[0];
              const sectorNumber = parts[1];
              
              return (
                <div key={sectorKey} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' : ''
                    }`} style={index > 2 ? { backgroundColor: '#de2828' } : {}}>
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {mainSector} - Setor {sectorNumber}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{count} fãs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fãs por Setor */}
      <UsersBySector users={users} />
    </div>
  );
};

export default StadiumMap;