// Subject interface
export interface Subject {
  subject_id: number;
  id?: number; // Alias for subject_id
  subject_name: string;
  name?: string; // Alias for subject_name
  subject_code: string;
  code?: string; // Alias for subject_code
  department?: string;
  description?: string;
  created_at?: Date;
  doubt_count?: number;
}

// Notification interface
export interface Notification {
  notification_id: number;
  user_id: number;
  doubt_id?: number;
  answer_id?: number;
  type: 'answer' | 'vote' | 'comment' | 'system';
  message: string;
  is_read: boolean;
  created_at: Date;
  doubt_title?: string;
}
