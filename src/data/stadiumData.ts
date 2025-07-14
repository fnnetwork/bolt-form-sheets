import { Sector } from '../types';

// Dados dos setores baseados no CSV fornecido
export const STADIUM_SECTORS = {
  NORTE: [
    { number: '427', letter: 'J', name: 'Norte Endzone - Nível 1' },
    { number: '428', letter: 'J', name: 'Norte Endzone - Nível 1' },
    { number: '429', letter: 'J', name: 'Norte Endzone - Nível 1' },
    { number: '430', letter: 'J', name: 'Norte Endzone - Nível 1' },
    { number: '431', letter: 'J', name: 'Norte Endzone - Nível 1' },
    { number: '432', letter: 'J', name: 'Norte Endzone - Nível 1' },
    { number: '433', letter: 'J', name: 'Norte Endzone - Nível 1' },
    { number: '434', letter: 'J', name: 'Norte Endzone - Nível 1' },
    { number: '.427.', letter: 'M', name: 'Norte Endzone - Nível 2' },
    { number: '.428.', letter: 'M', name: 'Norte Endzone - Nível 2' },
    { number: '.429.', letter: 'M', name: 'Norte Endzone - Nível 2' },
    { number: '.430.', letter: 'M', name: 'Norte Endzone - Nível 2' },
    { number: '.431.', letter: 'M', name: 'Norte Endzone - Nível 2' },
    { number: '.432.', letter: 'M', name: 'Norte Endzone - Nível 2' },
    { number: '.433.', letter: 'M', name: 'Norte Endzone - Nível 2' },
    { number: '.434.', letter: 'M', name: 'Norte Endzone - Nível 2' }
  ],
  SUL: [
    { number: '410', letter: 'J', name: 'Sul Endzone - Nível 1' },
    { number: '411', letter: 'J', name: 'Sul Endzone - Nível 1' },
    { number: '412', letter: 'J', name: 'Sul Endzone - Nível 1' },
    { number: '413', letter: 'J', name: 'Sul Endzone - Nível 1' },
    { number: '414', letter: 'J', name: 'Sul Endzone - Nível 1' },
    { number: '415', letter: 'J', name: 'Sul Endzone - Nível 1' },
    { number: '416', letter: 'J', name: 'Sul Endzone - Nível 1' },
    { number: '417', letter: 'J', name: 'Sul Endzone - Nível 1' },
    { number: '.410.', letter: 'M', name: 'Sul Endzone - Nível 2' },
    { number: '.411.', letter: 'M', name: 'Sul Endzone - Nível 2' },
    { number: '.412.', letter: 'M', name: 'Sul Endzone - Nível 2' },
    { number: '.413.', letter: 'M', name: 'Sul Endzone - Nível 2' },
    { number: '.414.', letter: 'M', name: 'Sul Endzone - Nível 2' },
    { number: '.415.', letter: 'M', name: 'Sul Endzone - Nível 2' },
    { number: '.416.', letter: 'M', name: 'Sul Endzone - Nível 2' },
    { number: '.417.', letter: 'M', name: 'Sul Endzone - Nível 2' }
  ],
  LESTE: [
    { number: '418', letter: 'G', name: 'Leste Inferior Lateral Corner - Nível 1' },
    { number: '419', letter: 'E', name: 'Leste Inferior Lateral - Nível 1' },
    { number: '420', letter: 'E', name: 'Leste Inferior Lateral - Nível 1' },
    { number: '421', letter: 'C', name: 'Leste Inferior Lateral Premium - Nível 1' },
    { number: '422', letter: 'A', name: 'Leste Inferior Central Premium - Nível 1' },
    { number: '423', letter: 'C', name: 'Leste Inferior Lateral Premium - Nível 1' },
    { number: '424', letter: 'E', name: 'Leste Inferior Lateral - Nível 1' },
    { number: '425', letter: 'E', name: 'Leste Inferior Lateral - Nível 1' },
    { number: '426', letter: 'G', name: 'Leste Inferior Lateral Corner - Nível 1' },
    { number: '617', letter: 'L', name: 'Leste Superior Lateral Corner - Nível 1' },
    { number: '618', letter: 'L', name: 'Leste Superior Lateral Corner - Nível 1' },
    { number: '619', letter: 'L', name: 'Leste Superior Lateral Corner - Nível 1' },
    { number: '620', letter: 'I', name: 'Leste Superior Lateral - Nível 1' },
    { number: '621', letter: 'I', name: 'Leste Superior Lateral - Nível 1' },
    { number: '622', letter: 'I', name: 'Leste Superior Lateral - Nível 1' },
    { number: '623', letter: 'I', name: 'Leste Superior Lateral - Nível 1' },
    { number: '624', letter: 'I', name: 'Leste Superior Lateral - Nível 1' },
    { number: '625', letter: 'L', name: 'Leste Superior Lateral Corner - Nível 1' },
    { number: '626', letter: 'L', name: 'Leste Superior Lateral Corner - Nível 1' },
    { number: '627', letter: 'L', name: 'Leste Superior Lateral Corner - Nível 1' },
    { number: '.418.', letter: 'H', name: 'Leste Inferior Lateral Corner - Nível 2' },
    { number: '.419.', letter: 'F', name: 'Leste Inferior Lateral - Nível 2' },
    { number: '.420.', letter: 'F', name: 'Leste Inferior Lateral - Nível 2' },
    { number: '.421.', letter: 'D', name: 'Leste Inferior Lateral Premium - Nível 2' },
    { number: '.422.', letter: 'B', name: 'Leste Inferior Central Premium - Nível 2' },
    { number: '.422.', letter: 'F', name: 'Leste Inferior Lateral - Nível 2' },
    { number: '.423.', letter: 'D', name: 'Leste Inferior Lateral Premium - Nível 2' },
    { number: '.425.', letter: 'F', name: 'Leste Inferior Lateral - Nível 2' },
    { number: '.426.', letter: 'H', name: 'Leste Inferior Lateral Corner - Nível 2' },
    { number: '.617.', letter: 'N', name: 'Leste Superior Lateral Corner - Nível 2' },
    { number: '.618.', letter: 'N', name: 'Leste Superior Lateral Corner - Nível 2' },
    { number: '.619.', letter: 'N', name: 'Leste Superior Lateral Corner - Nível 2' },
    { number: '.620.', letter: 'K', name: 'Leste Superior Lateral - Nível 2' },
    { number: '.621.', letter: 'K', name: 'Leste Superior Lateral - Nível 2' },
    { number: '.622.', letter: 'K', name: 'Leste Superior Lateral - Nível 2' },
    { number: '.623.', letter: 'K', name: 'Leste Superior Lateral - Nível 2' },
    { number: '.624.', letter: 'K', name: 'Leste Superior Lateral - Nível 2' },
    { number: '.625.', letter: 'N', name: 'Leste Superior Lateral Corner - Nível 2' },
    { number: '.626.', letter: 'N', name: 'Leste Superior Lateral Corner - Nível 2' },
    { number: '.627.', letter: 'N', name: 'Leste Superior Lateral Corner - Nível 2' }
  ],
  OESTE: [
    { number: '401', letter: 'G', name: 'Oeste Inferior Lateral Corner - Nível 1' },
    { number: '402', letter: 'E', name: 'Oeste Inferior Lateral - Nível 1' },
    { number: '403', letter: 'E', name: 'Oeste Inferior Lateral - Nível 1' },
    { number: '404', letter: 'C', name: 'Oeste Inferior Lateral Premium - Nível 1' },
    { number: '405', letter: 'A', name: 'Oeste Inferior Central Premium - Nível 1' },
    { number: '406', letter: 'C', name: 'Oeste Inferior Lateral Premium - Nível 1' },
    { number: '407', letter: 'E', name: 'Oeste Inferior Lateral - Nível 1' },
    { number: '408', letter: 'E', name: 'Oeste Inferior Lateral - Nível 1' },
    { number: '409', letter: 'G', name: 'Oeste Inferior Lateral Corner - Nível 1' },
    { number: '901', letter: 'L', name: 'Oeste Superior Lateral Corner - Nível 1' },
    { number: '902', letter: 'L', name: 'Oeste Superior Lateral Corner - Nível 1' },
    { number: '903', letter: 'L', name: 'Oeste Superior Lateral Corner - Nível 1' },
    { number: '904', letter: 'I', name: 'Oeste Superior Lateral - Nível 1' },
    { number: '908', letter: 'I', name: 'Oeste Superior Lateral - Nível 1' },
    { number: '908', letter: 'L', name: 'Oeste Superior Lateral Corner - Nível 1' },
    { number: '909', letter: 'L', name: 'Oeste Superior Lateral Corner - Nível 1' },
    { number: '910', letter: 'L', name: 'Oeste Superior Lateral Corner - Nível 1' },
    { number: '.401.', letter: 'H', name: 'Oeste Inferior Lateral Corner - Nível 2' },
    { number: '.402.', letter: 'F', name: 'Oeste Inferior Lateral - Nível 2' },
    { number: '.403.', letter: 'F', name: 'Oeste Inferior Lateral - Nível 2' },
    { number: '.404.', letter: 'D', name: 'Oeste Inferior Lateral Premium - Nível 2' },
    { number: '.405.', letter: 'B', name: 'Oeste Inferior Central Premium - Nível 2' },
    { number: '.406.', letter: 'D', name: 'Oeste Inferior Lateral Premium - Nível 2' },
    { number: '.407.', letter: 'F', name: 'Oeste Inferior Lateral - Nível 2' },
    { number: '.408.', letter: 'F', name: 'Oeste Inferior Lateral - Nível 2' },
    { number: '.409.', letter: 'H', name: 'Oeste Inferior Lateral Corner - Nível 2' },
    { number: '.901.', letter: 'N', name: 'Oeste Superior Lateral Corner - Nível 2' },
    { number: '.902.', letter: 'N', name: 'Oeste Superior Lateral Corner - Nível 2' },
    { number: '.903.', letter: 'N', name: 'Oeste Superior Lateral Corner - Nível 2' },
    { number: '.904.', letter: 'K', name: 'Oeste Superior Lateral - Nível 2' },
    { number: '.905.', letter: 'K', name: 'Oeste Superior Lateral - Nível 2' },
    { number: '.906.', letter: 'K', name: 'Oeste Superior Lateral - Nível 2' },
    { number: '.907.', letter: 'K', name: 'Oeste Superior Lateral - Nível 2' },
    { number: '.908.', letter: 'K', name: 'Oeste Superior Lateral - Nível 2' },
    { number: '.908.', letter: 'N', name: 'Oeste Superior Lateral Corner - Nível 2' },
    { number: '.909.', letter: 'N', name: 'Oeste Superior Lateral Corner - Nível 2' },
    { number: '.910.', letter: 'N', name: 'Oeste Superior Lateral Corner - Nível 2' }
  ]
};

// Setores principais para o mapa - ORIENTAÇÃO CORRIGIDA
export const MAIN_SECTORS = [
  {
    id: 'norte',
    name: 'NORTE',
    description: 'Lado Esquerdo',
    coordinates: { x: 50, y: 150, width: 80, height: 200 }, // Lado esquerdo
    color: '#EC4899' // Pink
  },
  {
    id: 'leste', 
    name: 'LESTE',
    description: 'Lado Superior',
    coordinates: { x: 130, y: 70, width: 340, height: 80 }, // Topo
    color: '#3B82F6' // Blue
  },
  {
    id: 'sul',
    name: 'SUL', 
    description: 'Lado Direito',
    coordinates: { x: 470, y: 150, width: 80, height: 200 }, // Lado direito
    color: '#EC4899' // Pink
  },
  {
    id: 'oeste',
    name: 'OESTE',
    description: 'Lado Inferior', 
    coordinates: { x: 130, y: 350, width: 340, height: 80 }, // Base
    color: '#10B981' // Green
  }
];

// Manter compatibilidade com código existente
export const SECTOR_SECTIONS = {
  NORTE: STADIUM_SECTORS.NORTE.map(sector => ({
    code: sector.number,
    name: sector.name,
    description: `Setor ${sector.number} - ${sector.letter}`
  })),
  SUL: STADIUM_SECTORS.SUL.map(sector => ({
    code: sector.number,
    name: sector.name,
    description: `Setor ${sector.number} - ${sector.letter}`
  })),
  LESTE: STADIUM_SECTORS.LESTE.map(sector => ({
    code: sector.number,
    name: sector.name,
    description: `Setor ${sector.number} - ${sector.letter}`
  })),
  OESTE: STADIUM_SECTORS.OESTE.map(sector => ({
    code: sector.number,
    name: sector.name,
    description: `Setor ${sector.number} - ${sector.letter}`
  }))
};

export const GAME_INFO = {
  date: new Date('2025-09-05T21:20:00-03:00'),
  teams: {
    home: 'Los Angeles Chargers',
    away: 'Kansas City Chiefs'
  },
  stadium: 'Neo Química Arena',
  city: 'São Paulo'
};