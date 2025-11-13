// User interface
export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
  yearOfStudy?: number;
  profilePicture?: string;
  createdAt?: Date;
}

// Auth response
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Signup data
export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role?: 'student' | 'faculty';
  department?: string;
  yearOfStudy?: number;
}
