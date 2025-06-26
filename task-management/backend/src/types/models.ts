export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: string; 
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  user_id: number;
  created_at: string; 
  updated_at: string; 
} 