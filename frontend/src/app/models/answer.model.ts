// Answer interface
export interface Answer {
  answer_id: number;
  id?: number; // Alias for answer_id
  doubt_id: number;
  user_id: number;
  answer_text: string;
  content?: string; // Alias for answer_text
  is_accepted: boolean;
  upvotes: number;
  downvotes: number;
  created_at: Date;
  updated_at: Date;
  author_name?: string;
  user_name?: string; // Alias for author_name
  author_role?: string;
  department?: string;
  userVote?: 'upvote' | 'downvote' | null;
}

// Create answer data
export interface CreateAnswerData {
  doubtId: number;
  answerText: string;
}

// Vote data
export interface VoteData {
  voteType: 'upvote' | 'downvote';
}
