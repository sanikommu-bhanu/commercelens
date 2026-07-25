export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  businessName: string;
  industry: string;
  avatar: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  loggedInAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}
