export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthProps {
  user: AuthUser | null;
}

export interface PageProps {
  auth?: AuthProps;
}
