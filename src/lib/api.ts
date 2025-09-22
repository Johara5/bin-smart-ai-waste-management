const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
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

  // Authentication
  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(username: string, email: string, password: string, city: string): Promise<{ user_id: number; username: string; token: string }> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, city }),
    });
  }
  
  // User management

  async getUser(username: string): Promise<User> {
    return this.request(`/users/${username}`);
  }
   
  // Rewards management
  async getRewards(): Promise<Reward[]> {
    return this.request('/rewards');
  }
   
  async redeemReward(userId: number, rewardId: number): Promise<{
    status: string;
    message: string;
    reward: Reward;
    remaining_points: number;
  }> {
    return this.request('/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, reward_id: rewardId }),
    });
  }
   
  // Waste disposal
  async recordWasteDisposal(data: {
    user_id: number;
    waste_type: string;
    quantity?: number;
    location_lat?: number;
    location_lng?: number;
    bin_id?: number;
  }): Promise<{
    status: string;
    message: string;
    points_earned: number;
    total_points: number;
  }> {
    return this.request('/waste-disposal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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



  // Leaderboard
  async getLeaderboard(): Promise<Array<{ username: string; total_points: number; created_at: string }>> {
    return this.request('/leaderboard');
  }
}

export const apiService = new ApiService();
