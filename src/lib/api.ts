const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface User {
  id: number;
  username: string;
  email: string;
  total_points: number;
  created_at: string;
}

export interface WasteScan {
  id: number;
  user_id: number;
  waste_type: 'Plastic' | 'Organic' | 'Paper' | 'E-Waste' | 'Glass';
  confidence_score: number;
  points_earned: number;
  image_path?: string;
  scan_date: string;
}

export interface Bin {
  id: number;
  location_name: string;
  latitude: number;
  longitude: number;
  bin_type: 'Plastic' | 'Organic' | 'Paper' | 'E-Waste' | 'Glass' | 'Mixed';
  capacity_level: 'Empty' | 'Low' | 'Medium' | 'High' | 'Full';
  created_at: string;
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  points_required: number;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface ScanResult {
  message: string;
  waste_type: string;
  confidence: number;
  points_earned: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }

  // User management
  async createUser(username: string, email: string): Promise<{ message: string }> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify({ username, email }),
    });
  }

  async getUser(username: string): Promise<User> {
    return this.request(`/users/${username}`);
  }

  async getUserStats(userId: number): Promise<{ user: User; scan_statistics: any[] }> {
    return this.request(`/user/${userId}/stats`);
  }

  // Waste scanning
  async submitScan(userId: number, wasteType: string, confidence?: number): Promise<ScanResult> {
    return this.request('/scan', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        waste_type: wasteType,
        confidence,
      }),
    });
  }

  // Bins
  async getBins(): Promise<Bin[]> {
    return this.request('/bins');
  }

  // Rewards
  async getRewards(): Promise<Reward[]> {
    return this.request('/rewards');
  }

  // Leaderboard
  async getLeaderboard(): Promise<Array<{ username: string; total_points: number; created_at: string }>> {
    return this.request('/leaderboard');
  }
}

export const apiService = new ApiService();
