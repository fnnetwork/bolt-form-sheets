import React, { useState, useEffect } from 'react';
import { Users, MapPin, ChevronDown, ChevronUp, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { User } from '../../types';
import { MAIN_SECTORS } from '../../data/stadiumData';

interface UsersBySectorProps {
  users: User[];
}

const UsersBySector: React.FC<UsersBySectorProps> = ({ users }) => {
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set());
  const [viewingDetails, setViewingDetails] = useState<Set<string>>(new Set());

  // Debug: Log users whenever they change
  useEffect(() => {
    console.log('👥 UsersBySector received users:', users.length);
    console.log('📋 Users with sectors:', users.filter(u => u.sector).map(u => ({ name: u.name, sector: u.sector })));
    console.log('📋 Users without sectors:', users.filter(u => !u.sector).map(u => u.name));
  }, [users]);

  const toggleSector = (sectorName: string) => {
    const newExpanded = new Set(expandedSectors);
    if (newExpanded.has(sectorName)) {
      newExpanded.delete(sectorName);
    } else {
      newExpanded.add(sectorName);
    }
    setExpandedSectors(newExpanded);
  };

  const toggleDetails = (sectorKey: string) => {
    const newViewing = new Set(viewingDetails);
    if (newViewing.has(sectorKey)) {
      newViewing.delete(sectorKey);
    } else {
      newViewing.add(sectorKey);
    }
    setViewingDetails(newViewing);
  };

  // Group users by sector
  const usersBySector = users.reduce((acc, user) => {
    if (user.sector) {
      const mainSector = user.sector.split('-')[0];
      if (!acc[mainSector]) {
        acc[mainSector] = [];
      }
      acc[mainSector].push(user);
    }
    return acc;
  }, {} as Record<string, User[]>);

  // Debug: Log grouped users
  useEffect(() => {
    console.log('🗂️ Users grouped by sector:', usersBySector);
    Object.entries(usersBySector).forEach(([sector, sectorUsers]) => {
      console.log(`📍 ${sector}:`, sectorUsers.map(u => u.name));
    });
  }, [usersBySector]);

  // Group users by specific sector number within each main sector
  const getUsersBySpecificSector = (mainSector: string) => {
    const sectorUsers = usersBySector[mainSector] || [];
    return sectorUsers.reduce((acc, user) => {
      if (user.sector) {
        const parts = user.sector.split('-');
        const specificSector = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : user.sector;
        if (!acc[specificSector]) {
          acc[specificSector] = [];
        }
        acc[specificSector].push(user);
      }
      return acc;
    }, {} as Record<string, User[]>);
  };

  // Users without sector
  const usersWithoutSector = users.filter(user => !user.sector);

  const formatUserSector = (sector: string) => {
    if (sector.includes('-')) {
      const parts = sector.split('-');
      return `${parts[0]} - ${parts[1]}${parts[2] ? ` - ${parts[2]}` : ''}`;
    }
    return `Setor ${sector}`;
  };

  const getSectorColor = (sectorName: string) => {
    const sector = MAIN_SECTORS.find(s => s.name === sectorName);
    return sector?.color || '#de2828';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MapPin className="w-6 h-6 mr-2" style={{ color: '#de2828' }} />
          <h3 className="text-xl font-bold text-gray-900">Fãs por Setor</h3>
        </div>
        
        {/* Debug info - remove in production */}
        <div className="text-sm text-gray-500">
          Total: {users.length} | Com setor: {users.filter(u => u.sector).length}
        </div>
      </div>

      <div className="space-y-4">
        {/* Users with sectors */}
        {MAIN_SECTORS.map((sector) => {
          const sectorUsers = usersBySector[sector.name] || [];
          const isExpanded = expandedSectors.has(sector.name);
          const specificSectors = getUsersBySpecificSector(sector.name);
          
          if (sectorUsers.length === 0) return null;

          return (
            <div key={sector.name} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSector(sector.name)}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: getSectorColor(sector.name) }}
                  ></div>
                  <h4 className="font-semibold text-gray-900">Lado {sector.name}</h4>
                  <span className="ml-2 text-sm text-gray-600">({sectorUsers.length} fãs)</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 bg-white">
                  {/* Group by specific sectors */}
                  <div className="space-y-4">
                    {Object.entries(specificSectors).map(([specificSector, specificUsers]) => {
                      const sectorKey = specificSector;
                      const isViewingDetails = viewingDetails.has(sectorKey);
                      const parts = specificSector.split('-');
                      const sectorNumber = parts[1];
                      
                      return (
                        <div key={specificSector} className="border border-gray-100 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-gray-50">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: getSectorColor(sector.name) }}
                              ></div>
                              <span className="font-medium text-gray-900">
                                Setor {sectorNumber}
                              </span>
                              <span className="ml-2 text-sm text-gray-600">
                                ({specificUsers.length} fãs)
                              </span>
                            </div>
                            <button
                              onClick={() => toggleDetails(sectorKey)}
                              className="flex items-center px-2 py-1 text-xs rounded transition-colors duration-200"
                              style={{ 
                                backgroundColor: isViewingDetails ? '#de2828' : '#f3f4f6',
                                color: isViewingDetails ? 'white' : '#374151'
                              }}
                            >
                              {isViewingDetails ? (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Ocultar
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Ver Fãs
                                </>
                              )}
                            </button>
                          </div>

                          {isViewingDetails && (
                            <div className="p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {specificUsers.map((user) => (
                                  <div
                                    key={user.id}
                                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                  >
                                    <div 
                                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                      style={{ background: `linear-gradient(to bottom right, ${getSectorColor(sector.name)}, #b91c1c)` }}
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
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Users without sector */}
        {usersWithoutSector.length > 0 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSector('sem-setor')}
              className="w-full p-4 bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-3 bg-yellow-500"></div>
                <h4 className="font-semibold text-gray-900">Sem Setor Definido</h4>
                <span className="ml-2 text-sm text-gray-600">({usersWithoutSector.length} fãs)</span>
              </div>
              {expandedSectors.has('sem-setor') ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSectors.has('sem-setor') && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {usersWithoutSector.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 bg-yellow-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-yellow-600">Precisa definir setor</p>
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
        )}
      </div>

      {Object.keys(usersBySector).length === 0 && usersWithoutSector.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum usuário cadastrado ainda</p>
        </div>
      )}
    </div>
  );
};

export default UsersBySector;