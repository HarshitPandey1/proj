// Doubt interface
export interface Doubt {
  doubt_id: number;
  id?: number; // Alias for doubt_id
  user_id: number;
  student_id?: number; // Alias for user_id
  subject_id?: number;
  title: string;
  description: string;
  image_url?: string;
  is_resolved: boolean;
  status?: string; // 'open' | 'answered' | 'resolved'
  views_count: number;
  view_count?: number; // Alias for views_count
  created_at: Date;
  updated_at: Date;
  author_name?: string;
  student_name?: string; // Alias for author_name
  author_role?: string;
  subject_name?: string;
  subject_code?: string;
  answer_count?: number;
  tags?: string[];
}

// Create doubt data
export interface CreateDoubtData {
  title: string;
  description: string;
  subjectId?: number;
  tags?: string[];
  image?: File;
}

// Update doubt data
export interface UpdateDoubtData {
  title?: string;
  description?: string;
  subjectId?: number;
  isResolved?: boolean;
}

// Doubt filters
export interface DoubtFilters {
  limit?: number;
  offset?: number;
  subjectId?: number;
  isResolved?: boolean;
  userId?: number;
  search?: string;
  tag?: string;
}
