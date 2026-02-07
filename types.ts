
export enum UserRole {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  ADMIN = 'ADMIN'
}

export enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  RESERVED = 'RESERVED'
}

export interface LibraryCard {
  cardNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  libraryCard?: LibraryCard;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  department: string;
  course: string;
  coverUrl: string;
  description: string;
  status: BookStatus;
  publishYear: number;
  academicYear: string;
  // eLibrary Extensions
  isDigital: boolean;
  pdfUrl?: string;
  downloadCount?: number;
  resourceType: 'EBOOK' | 'JOURNAL' | 'THESIS' | 'PHYSICAL';
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
}

export interface Reservation {
  id: string;
  bookId: string;
  userId: string;
  reservationDate: string;
  expiryDate: string;
}

export interface AcademicEvent {
  id: string;
  title: string;
  date: string;
  type: 'EXAM' | 'HOLIDAY' | 'LIBRARY_EVENT' | 'SEMESTER_START' | 'SEMESTER_END';
  description: string;
}

export interface AcademicYearConfig {
  year: string;
  semester: string;
}
