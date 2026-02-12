import axios from 'axios';
import type { Plan } from '../types/Plan';

// Use Vite proxy to bypass CORS - requests to /api get forwarded to localhost:5005


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const planService = {
  // Get all plans
  async getAll(): Promise<Plan[]> {
    try {
      const response = await api.get<Plan[]>('/api/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  },

  // Get a single plan by ID
  async getById(id: string): Promise<Plan> {
    try {
      const response = await api.get<Plan>(`/api/plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plan:', error);
      throw error;
    }
  },

  // Create a new plan
  async create(plan: Omit<Plan, 'id' | 'createdAt'>): Promise<Plan> {
    try {
      console.log('Creating plan with data:', plan);
      const response = await api.post<Plan>('/api/plans', plan);
      return response.data;
    } catch (error: any) {
      console.error('Error creating plan:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      // Show alert with backend error
      alert('Backend error: ' + JSON.stringify(error.response?.data || 'Unknown error'));
      throw error;
    }
  },

  // Update an existing plan
  async update(id: string, plan: Partial<Plan>): Promise<Plan> {
    try {
      const response = await api.put<Plan>(`/api/plans/${id}`, plan);
      return response.data;
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  },

  // Delete a plan
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/plans/${id}`);
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  },

  // Toggle plan completion
  async toggleComplete(id: string): Promise<Plan> {
    try {
      const response = await api.patch<Plan>(`/api/plans/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling plan completion:', error);
      throw error;
    }
  },
};

export default planService;
