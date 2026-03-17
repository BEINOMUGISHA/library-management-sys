
import React from 'react';
import { Book, User, UserRole, BookStatus, AcademicEvent, ResourceType } from '../types';

export const ACADEMIC_YEAR_CONFIG = {
  year: '2024/2025',
  semester: 'Semester II'
};

export const BORROW_LIMITS: Record<UserRole, number> = {
  [UserRole.STUDENT]: 3,
  [UserRole.LECTURER]: 7,
  [UserRole.STAFF]: 5,
  [UserRole.LIBRARIAN]: 15,
  [UserRole.ADMIN]: 10
};

export const MOCK_EVENTS: AcademicEvent[] = [
  { id: 'e1', title: 'Digital Literacy Week', date: '2025-02-15', type: 'LIBRARY_EVENT', description: 'Exploring the new BBUC eLibrary and global academic repositories.' },
  { id: 'e2', title: 'Semester II Orientation', date: '2025-02-20', type: 'SEMESTER_START', description: 'Welcome and orientation for all new and returning students.' },
  { id: 'e4', title: 'Final Examination Period', date: '2025-06-01', type: 'EXAM', description: '24/7 Digital Portal support during examination season.' }
];

export const MOCK_BOOKS: Book[] = [
  // --- Digital Resources (IT) ---
  { 
    id: 'it1', 
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship', 
    author: 'Robert C. Martin', 
    isbn: '978-0132350884', 
    category: 'Programming', 
    department: 'IT', 
    course: 'Information Technology', 
    coverUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400', 
    description: 'The fundamental principles of writing readable and maintainable software.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2008, 
    academicYear: 'Year 1',
    isDigital: true,
    resourceType: ResourceType.EBOOK,
    pdfUrl: '#'
  },
  { 
    id: 'it5', 
    title: 'Networking: A Top-Down Approach', 
    author: 'James Kurose', 
    isbn: '978-0133937633', 
    category: 'Networks', 
    department: 'IT', 
    course: 'Information Technology', 
    coverUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400', 
    description: 'Understanding global connectivity from the application layer down.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2020, 
    academicYear: 'Year 3',
    isDigital: true,
    resourceType: ResourceType.EBOOK,
    pdfUrl: '#'
  },
  // --- Physical Resources (Theology) ---
  { 
    id: 'th1', 
    title: 'Systematic Theology: An Introduction', 
    author: 'Wayne Grudem', 
    isbn: '978-0310286707', 
    category: 'Theology', 
    department: 'Theology', 
    course: 'Theology & Divinity', 
    coverUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=400', 
    description: 'A modern classic providing a rigorous look at biblical teaching.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 1994, 
    academicYear: 'Year 1',
    isDigital: false,
    resourceType: ResourceType.PHYSICAL
  },
  // --- Digital Journals ---
  { 
    id: 'th5', 
    title: 'African Journal of Theology (Vol. 12)', 
    author: 'BBUC Research Dept', 
    isbn: 'ISSN-2210-449', 
    category: 'Research', 
    department: 'Theology', 
    course: 'Theology & Divinity', 
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400', 
    description: 'Annual research publication focusing on contemporary theological discourse in East Africa.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2024, 
    academicYear: 'All Years',
    isDigital: true,
    resourceType: ResourceType.JOURNAL,
    pdfUrl: '#'
  },
  { 
    id: 'ba1', 
    title: 'Principles of Marketing in Uganda', 
    author: 'Philip Kotler', 
    isbn: '978-0134492452', 
    category: 'Marketing', 
    department: 'Business', 
    course: 'Business Administration', 
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400', 
    description: 'Understanding consumer value and building profitable relationships in localized markets.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2023, 
    academicYear: 'Year 1',
    isDigital: true,
    resourceType: ResourceType.EBOOK
  },
  { 
    id: 'sw1', 
    title: 'Social Psychology & Community Development', 
    author: 'Elliot Aronson', 
    isbn: '978-0134641287', 
    category: 'Sociology', 
    department: 'Social Sciences', 
    course: 'Social Work', 
    coverUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400', 
    description: 'How we think about, influence, and relate to one another in rural development contexts.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2022, 
    academicYear: 'Year 1',
    isDigital: true,
    resourceType: ResourceType.EBOOK
  },
  { 
    id: 'ed1', 
    title: 'Foundations of Modern Education', 
    author: 'John Dewey', 
    isbn: '978-0486225005', 
    category: 'Education', 
    department: 'Education', 
    course: 'Bachelor of Education', 
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400', 
    description: 'A comprehensive look at the philosophical underpinnings of modern educational systems.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2018, 
    academicYear: 'Year 1',
    isDigital: true,
    resourceType: ResourceType.EBOOK
  },
  { 
    id: 'nu1', 
    title: 'Clinical Nursing Skills & Techniques', 
    author: 'Anne Griffin Perry', 
    isbn: '978-0323655361', 
    category: 'Nursing', 
    department: 'Nursing', 
    course: 'Nursing Science', 
    coverUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400', 
    description: 'Essential guide for clinical practice and patient care in modern healthcare settings.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2021, 
    academicYear: 'Year 2',
    isDigital: false,
    resourceType: ResourceType.PHYSICAL
  },
  { 
    id: 'ba2', 
    title: 'Financial Accounting: A Global Perspective', 
    author: 'Rod Monger', 
    isbn: '978-1408017968', 
    category: 'Accounting', 
    department: 'Business', 
    course: 'Business Administration', 
    coverUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400', 
    description: 'Mastering the language of business through international accounting standards.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2022, 
    academicYear: 'Year 2',
    isDigital: true,
    resourceType: ResourceType.EBOOK
  },
  { 
    id: 'sw2', 
    title: 'Community Organizing and Development', 
    author: 'Herbert J. Rubin', 
    isbn: '978-0205408139', 
    category: 'Social Work', 
    department: 'Social Sciences', 
    course: 'Social Work', 
    coverUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=400', 
    description: 'Strategies for empowering communities and driving social change.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2019, 
    academicYear: 'Year 3',
    isDigital: false,
    resourceType: ResourceType.PHYSICAL
  },
  { 
    id: 'it10', 
    title: 'Introduction to Algorithms', 
    author: 'Thomas H. Cormen', 
    isbn: '978-0262033848', 
    category: 'Algorithms', 
    department: 'IT', 
    course: 'Information Technology', 
    coverUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=400', 
    description: 'The standard textbook for algorithm design and analysis.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2009, 
    academicYear: 'Year 2',
    isDigital: false,
    resourceType: ResourceType.PHYSICAL
  },
  { 
    id: 'th10', 
    title: 'Church History in Plain Language', 
    author: 'Bruce L. Shelley', 
    isbn: '978-0310515142', 
    category: 'History', 
    department: 'Theology', 
    course: 'Theology & Divinity', 
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400', 
    description: 'A concise and readable history of the Christian church.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2013, 
    academicYear: 'Year 2',
    isDigital: false,
    resourceType: ResourceType.PHYSICAL
  },
  { 
    id: 'ed10', 
    title: 'Educational Psychology', 
    author: 'Anita Woolfolk', 
    isbn: '978-0134774329', 
    category: 'Psychology', 
    department: 'Education', 
    course: 'Bachelor of Education', 
    coverUrl: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=400', 
    description: 'The most current and comprehensive text in the field of educational psychology.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2019, 
    academicYear: 'Year 2',
    isDigital: true,
    resourceType: ResourceType.EBOOK
  },
  { 
    id: 'ba10', 
    title: 'Business Ethics: Concepts and Cases', 
    author: 'Manuel G. Velasquez', 
    isbn: '978-0205017669', 
    category: 'Ethics', 
    department: 'Business', 
    course: 'Business Administration', 
    coverUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400', 
    description: 'A thorough introduction to the ethical issues in business.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2017, 
    academicYear: 'Year 3',
    isDigital: false,
    resourceType: ResourceType.PHYSICAL
  },
  { 
    id: 'it11', 
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship', 
    author: 'Robert C. Martin', 
    isbn: '978-0132350884', 
    category: 'Software Engineering', 
    department: 'IT', 
    course: 'Information Technology', 
    coverUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400', 
    description: 'A guide to writing better, cleaner code that is easier to maintain.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2008, 
    academicYear: 'Year 3',
    isDigital: true,
    resourceType: ResourceType.EBOOK
  },
  { 
    id: 'ns11', 
    title: 'Human Anatomy & Physiology', 
    author: 'Elaine N. Marieb', 
    isbn: '978-0134580999', 
    category: 'Anatomy', 
    department: 'Nursing', 
    course: 'Nursing Science', 
    coverUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=400', 
    description: 'The definitive guide to the human body systems and functions.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2018, 
    academicYear: 'Year 1',
    isDigital: false,
    resourceType: ResourceType.PHYSICAL
  },
  { 
    id: 'th11', 
    title: 'Systematic Theology', 
    author: 'Wayne Grudem', 
    isbn: '978-0310286707', 
    category: 'Theology', 
    department: 'Theology', 
    course: 'Theology & Divinity', 
    coverUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=400', 
    description: 'An introduction to biblical doctrine with a focus on clarity and accessibility.', 
    status: BookStatus.AVAILABLE, 
    publishYear: 2020, 
    academicYear: 'Year 3',
    isDigital: false,
    resourceType: ResourceType.PHYSICAL
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Sarah Smith', email: 'sarah.smith@bbuc.ac.ug', role: UserRole.LECTURER, department: 'Theology', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'u2', name: 'John Doe', email: 'john.doe@student.bbuc.ac.ug', role: UserRole.STUDENT, department: 'IT', avatar: 'https://i.pravatar.cc/150?u=john' },
  { id: 'u3', name: 'Alice Admin', email: 'admin@library.bbuc.ac.ug', role: UserRole.ADMIN, department: 'Library Services', avatar: 'https://i.pravatar.cc/150?u=admin' }
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
  ),
  GraduationCap: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  ),
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
  ),
  Cloud: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19x2.5a4.5 4.5 0 0 0 0-9 4.48 4.48 0 0 0-4.5 4.5"/><path d="M17.5 19A4.5 4.5 0 0 0 13 14.5c0-.05.01-.1.01-.15a4.49 4.49 0 0 0-8.5-1.35 4.5 4.5 0 0 0 0 9Z"/></svg>
  )
};
