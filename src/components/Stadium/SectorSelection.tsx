import React, { useState, useEffect } from 'react';
import { MapPin, Users, Check, Edit3, ChevronDown } from 'lucide-react';
import { MAIN_SECTORS, STADIUM_SECTORS } from '../../data/stadiumData';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

interface SectorSelectionProps {
  users: User[];
  onSectorUpdate: () => void;
}

const SectorSelection: React.FC<SectorSelectionProps> = ({ users, onSectorUpdate }) => {
  const { user, updateUser } = useAuth();
  const [selectedMainSector, setSelectedMainSector] = useState<string | null>(null);
  const [selectedSectorNumber, setSelectedSectorNumber] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [isEditing, setIsEditing] = useState(!user?.sector);

  useEffect(() => {
    if (user?.sector && user.sector.includes('-')) {
      const parts = user.sector.split('-');
      if (parts.length >= 2) {
        setSelectedMainSector(parts[0]);
        setSelectedSectorNumber(parts[1]);
        setSelectedRow(parts[2] || '');
      }
    }
  }, [user?.sector]);

  const handleSectorSave = () => {
    if (selectedMainSector && selectedSectorNumber && selectedRow && user) {
      const fullSectorCode = `${selectedMainSector}-${selectedSectorNumber}-${selectedRow}`;
      updateUser({ sector: fullSectorCode });
      setIsEditing(false);
      onSectorUpdate();
    }
  };

  const getSectorFanCount = (mainSector: string) => {
    return users.filter(user => user.sector?.startsWith(mainSector)).length;
  };

  const getSectorNumberFanCount = (mainSector: string, sectorNumber: string) => {
    return users.filter(user => user.sector?.startsWith(`${mainSector}-${sectorNumber}`)).length;
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

  const getCurrentSectorInfo = () => {
    if (!user?.sector || !user.sector.includes('-')) return null;
    
    const parts = user.sector.split('-');
    const mainSector = parts[0];
    const sectorNumber = parts[1];
    const row = parts[2] || '';
    
    const sectors = STADIUM_SECTORS[mainSector as keyof typeof STADIUM_SECTORS];
    const sectorInfo = sectors?.find(s => s.number === sectorNumber);
    
    return {
      mainSector,
      sectorNumber,
      row,
      sectorInfo,
      fans: users.filter(u => u.sector === user.sector)
    };
  };

  if (!isEditing && user?.sector) {
    const currentInfo = getCurrentSectorInfo();
    
    if (!currentInfo) {
      setIsEditing(true);
      return null;
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(to bottom right, #de2828, #b91c1c)' }}>
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sua Localização</h2>
          <p className="text-gray-600">Você está cadastrado em:</p>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-1" style={{ color: '#de2828' }}>
              Lado {currentInfo.mainSector}
            </h3>
            <h4 className="text-xl font-semibold mb-1" style={{ color: '#b91c1c' }}>
              Setor {currentInfo.sectorNumber}
            </h4>
            <h5 className="text-lg font-medium mb-3" style={{ color: '#991b1b' }}>
              Fileira {currentInfo.row}
            </h5>
            <p className="mb-4" style={{ color: '#b91c1c' }}>
              {currentInfo.sectorInfo?.name}
            </p>
            
            <div className="flex items-center justify-center mb-4" style={{ color: '#de2828' }}>
              <Users className="w-5 h-5 mr-2" />
              <span className="font-semibold">
                {currentInfo.fans.length} fãs da A+BDB nesta localização
              </span>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors duration-200"
              style={{ backgroundColor: '#de2828' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c41e1e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#de2828'}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Alterar Localização
            </button>
          </div>
        </div>

        {currentInfo.fans.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Fãs na sua localização:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentInfo.fans.map((fan) => (
                <div
                  key={fan.id}
                  className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #de2828, #b91c1c)' }}>
                    <span className="text-white font-semibold text-sm">
                      {fan.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{fan.name}</p>
                    {fan.bio && (
                      <p className="text-sm text-gray-600">{fan.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(to bottom right, #de2828, #b91c1c)' }}>
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {user?.sector ? 'Alterar Localização' : 'Selecione sua Localização'}
        </h2>
        <p className="text-gray-600">
          Informe o lado do estádio, setor e fileira
        </p>
      </div>

      {/* Seleção de Lado Principal */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lado do Estádio
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MAIN_SECTORS.map((sector) => {
            const fanCount = getSectorFanCount(sector.name);
            const isSelected = selectedMainSector === sector.name;
            
            return (
              <button
                key={sector.id}
                onClick={() => {
                  setSelectedMainSector(sector.name);
                  setSelectedSectorNumber('');
                  setSelectedRow('');
                }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'bg-red-50'
                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                }`}
                style={isSelected ? { borderColor: '#de2828' } : {}}
              >
                <div className="text-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: sector.color }}
                  >
                    <span className="text-white font-bold text-sm">
                      {sector.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {sector.name}
                  </h3>
                  <div className="flex items-center justify-center" style={{ color: '#de2828' }}>
                    <Users className="w-3 h-3 mr-1" />
                    <span className="text-xs">{fanCount}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seleção de Setor e Fileira */}
      {selectedMainSector && (
        <div className="bg-red-50 rounded-xl p-6 mb-6" style={{ borderColor: '#de2828', borderWidth: '1px' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#de2828' }}>
            Detalhes do Lado {selectedMainSector}
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
                
                return sectorInfo ? (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Setor {sectorInfo.number} - {sectorInfo.letter}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{sectorInfo.name}</p>
                    <div className="flex items-center" style={{ color: '#de2828' }}>
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{fanCount} fãs da A+BDB neste setor</span>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex gap-3">
        {user?.sector && (
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={handleSectorSave}
          disabled={!selectedMainSector || !selectedSectorNumber || !selectedRow}
          className="flex-1 px-4 py-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
          style={{ backgroundColor: '#de2828' }}
          onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#c41e1e')}
          onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#de2828')}
        >
          {user?.sector ? 'Salvar Alteração' : 'Confirmar Localização'}
        </button>
      </div>
    </div>
  );
};

export default SectorSelection;