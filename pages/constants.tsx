
import React from 'react';
import { Book, User, UserRole, BookStatus, AcademicEvent } from '../types';

export const ACADEMIC_YEAR_CONFIG = {
  year: '2024/2025',
  semester: 'Semester II'
};

export const MOCK_EVENTS: AcademicEvent[] = [
  {
    id: 'e1',
    title: 'Semester II Orientation',
    date: '2025-02-15',
    type: 'SEMESTER_START',
    description: 'Welcome and orientation for all new and returning students.'
  },
  {
    id: 'e2',
    title: 'Library Information Literacy Workshop',
    date: '2025-03-05',
    type: 'LIBRARY_EVENT',
    description: 'Learn how to use digital repositories and e-resources effectively.'
  },
  {
    id: 'e3',
    title: 'Mid-Semester Break',
    date: '2025-04-10',
    type: 'HOLIDAY',
    description: 'Short break for students and staff.'
  },
  {
    id: 'e4',
    title: 'Final Examination Period',
    date: '2025-06-01',
    type: 'EXAM',
    description: 'Library hours extended to 24/7 during this period.'
  },
  {
    id: 'e5',
    title: 'BBUC Annual Book Fair',
    date: '2025-03-20',
    type: 'LIBRARY_EVENT',
    description: 'Local and international publishers showcasing academic works.'
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Foundations of Modern Education',
    author: 'John Dewey',
    isbn: '978-0465016303',
    category: 'Pedagogy',
    department: 'Education',
    course: 'Education',
    coverUrl: 'https://picsum.photos/seed/edu1/400/600',
    description: 'An exploration of educational theories and their impact on modern society.',
    status: BookStatus.AVAILABLE,
    publishYear: 1916
  },
  {
    id: '2',
    title: 'Networking Essentials',
    author: 'Andrew S. Tanenbaum',
    isbn: '978-0132126953',
    category: 'Networks',
    department: 'IT',
    course: 'Information Technology',
    coverUrl: 'https://picsum.photos/seed/it1/400/600',
    description: 'A comprehensive guide to computer networking and protocols.',
    status: BookStatus.BORROWED,
    publishYear: 2021
  },
  {
    id: '3',
    title: 'Systematic Theology',
    author: 'Wayne Grudem',
    isbn: '978-0310286707',
    category: 'Theology',
    department: 'Theology',
    course: 'Theology & Divinity',
    coverUrl: 'https://picsum.photos/seed/theo1/400/600',
    description: 'An introduction to biblical doctrine for students of the Bible.',
    status: BookStatus.AVAILABLE,
    publishYear: 1994
  },
  {
    id: '4',
    title: 'Principles of Marketing',
    author: 'Philip Kotler',
    isbn: '978-0134492452',
    category: 'Marketing',
    department: 'Business',
    course: 'Business Administration',
    coverUrl: 'https://picsum.photos/seed/biz1/400/600',
    description: 'The standard textbook for understanding consumer markets and business strategy.',
    status: BookStatus.RESERVED,
    publishYear: 2017
  },
  {
    id: '5',
    title: 'The Elements of Journalism',
    author: 'Bill Kovach',
    isbn: '978-0804136785',
    category: 'Media',
    department: 'Journalism',
    course: 'Journalism & Media',
    coverUrl: 'https://picsum.photos/seed/jour1/400/600',
    description: 'What newspeople should know and the public should expect.',
    status: BookStatus.AVAILABLE,
    publishYear: 2014
  },
  {
    id: '6',
    title: 'Social Psychology',
    author: 'Elliot Aronson',
    isbn: '978-0134641287',
    category: 'Sociology',
    department: 'Social Sciences',
    course: 'Social Work',
    coverUrl: 'https://picsum.photos/seed/soc1/400/600',
    description: 'How we think about, influence, and relate to one another in society.',
    status: BookStatus.AVAILABLE,
    publishYear: 2018
  },
  {
    id: '7',
    title: 'Java Programming',
    author: 'Herbert Schildt',
    isbn: '978-1260440232',
    category: 'Programming',
    department: 'IT',
    course: 'Information Technology',
    coverUrl: 'https://picsum.photos/seed/it2/400/600',
    description: 'The complete guide to Java programming language for beginners and pros.',
    status: BookStatus.AVAILABLE,
    publishYear: 2018
  },
  {
    id: '8',
    title: 'Old Testament Survey',
    author: 'Paul House',
    isbn: '978-0805410754',
    category: 'Theology',
    department: 'Theology',
    course: 'Theology & Divinity',
    coverUrl: 'https://picsum.photos/seed/theo2/400/600',
    description: 'A detailed look at the historical and theological context of the Old Testament.',
    status: BookStatus.AVAILABLE,
    publishYear: 1992
  }
];

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Dr. Sarah Smith', 
    email: 'sarah.smith@bbuc.ac.ug', 
    role: UserRole.LECTURER, 
    department: 'Theology',
    avatar: 'https://i.pravatar.cc/150?u=sarah' 
  },
  { 
    id: 'u2', 
    name: 'John Doe', 
    email: 'john.doe@student.bbuc.ac.ug', 
    role: UserRole.STUDENT, 
    department: 'IT',
    avatar: 'https://i.pravatar.cc/150?u=john' 
  },
  { 
    id: 'u3', 
    name: 'Alice Admin', 
    email: 'admin@library.bbuc.ac.ug', 
    role: UserRole.ADMIN, 
    department: 'Library Services',
    avatar: 'https://i.pravatar.cc/150?u=admin' 
  }
];

export const Icons = {
  Library: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/><path d="M12 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-4"/><path d="M16 2v4"/><path d="M12 2v4"/><path d="M8 2v4"/></svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  ),
  BookOpen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  LogOut: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  IdCard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M7 9h2"/><path d="M7 12h2"/><path d="M7 15h2"/><circle cx="15" cy="12" r="3"/></svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  )
};
