
export type UserRole = 'TEACHER' | 'STUDENT';

export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'GRADED';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  inviteCode: string;
  teacher?: User; //optional teacher info
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string; 
  maxScore: number;
  courseId?: number;
}

export interface Submission {
  id: number;
  content: string;
  grade?: number;
  feedback?: string;
  status: SubmissionStatus;
  submittedAt?: string;
  student?: User;
}