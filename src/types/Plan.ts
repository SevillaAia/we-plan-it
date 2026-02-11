// WeatherForecast interface for weather feature
export interface WeatherForecast {
  id: string;
  date: string; // ISO string
  location: string;
  temperature: number;
  description?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
export interface Plan {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  completed: boolean;
  address: string | null;
  telephone: string | null;
  email: string | null;
  createdAt: Date;
}
