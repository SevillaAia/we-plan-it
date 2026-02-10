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
