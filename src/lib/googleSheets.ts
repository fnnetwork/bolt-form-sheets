interface GoogleSheetsUser {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  sector?: string;
  bio?: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

class GoogleSheetsAPI {
  private apiKey: string;
  private spreadsheetId: string;
  private range: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
    this.spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
    this.range = import.meta.env.VITE_GOOGLE_SHEETS_RANGE || 'Sheet1!A:H';

    if (!this.apiKey || !this.spreadsheetId) {
      throw new Error('Missing Google Sheets API configuration. Please set VITE_GOOGLE_SHEETS_API_KEY and VITE_GOOGLE_SHEETS_SPREADSHEET_ID in your .env file');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/${endpoint}?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getUsers(): Promise<GoogleSheetsUser[]> {
    try {
      const response = await this.makeRequest(`values/${this.range}`);
      
      if (!response.values || response.values.length === 0) {
        return [];
      }

      // Skip header row and convert to user objects
      const users = response.values.slice(1).map((row: string[], index: number) => ({
        id: row[0] || `user_${index + 1}`,
        name: row[1] || '',
        email: row[2] || '',
        whatsapp: row[3] || '',
        sector: row[4] || undefined,
        bio: row[5] || undefined,
        avatar: row[6] || undefined,
        isAdmin: row[7] === 'true',
        createdAt: row[8] || new Date().toISOString(),
        updatedAt: row[9] || new Date().toISOString(),
      }));

      return users;
    } catch (error) {
      console.error('Error fetching users from Google Sheets:', error);
      throw error;
    }
  }

  async addUser(user: Omit<GoogleSheetsUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<GoogleSheetsUser> {
    try {
      const id = `user_${Date.now()}`;
      const now = new Date().toISOString();
      
      const newUser: GoogleSheetsUser = {
        ...user,
        id,
        createdAt: now,
        updatedAt: now,
      };

      const values = [[
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.whatsapp,
        newUser.sector || '',
        newUser.bio || '',
        newUser.avatar || '',
        newUser.isAdmin.toString(),
        newUser.createdAt,
        newUser.updatedAt,
      ]];

      await this.makeRequest(`values/${this.range}:append?valueInputOption=RAW`, {
        method: 'POST',
        body: JSON.stringify({ values }),
      });

      return newUser;
    } catch (error) {
      console.error('Error adding user to Google Sheets:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updates: Partial<GoogleSheetsUser>): Promise<GoogleSheetsUser | null> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return null;
      }

      const updatedUser = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Update the specific row (add 2 to account for header row and 0-based indexing)
      const rowNumber = userIndex + 2;
      const range = `Sheet1!A${rowNumber}:J${rowNumber}`;
      
      const values = [[
        updatedUser.id,
        updatedUser.name,
        updatedUser.email,
        updatedUser.whatsapp,
        updatedUser.sector || '',
        updatedUser.bio || '',
        updatedUser.avatar || '',
        updatedUser.isAdmin.toString(),
        updatedUser.createdAt,
        updatedUser.updatedAt,
      ]];

      await this.makeRequest(`values/${range}?valueInputOption=RAW`, {
        method: 'PUT',
        body: JSON.stringify({ values }),
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating user in Google Sheets:', error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<GoogleSheetsUser | null> {
    try {
      const users = await this.getUsers();
      return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
}

export const googleSheetsAPI = new GoogleSheetsAPI();