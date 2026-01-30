
import React from 'react';
import { Book, User, UserRole, BookStatus, AcademicEvent } from '../types';

export const ACADEMIC_YEAR_CONFIG = {
  year: '2024/2025',
  semester: 'Semester II'
};

export const BORROW_LIMITS: Record<UserRole, number> = {
  [UserRole.STUDENT]: 3,
  [UserRole.LECTURER]: 7,
  [UserRole.ADMIN]: 10
};

export const MOCK_EVENTS: AcademicEvent[] = [
  { id: 'e1', title: 'Semester II Orientation', date: '2025-02-15', type: 'SEMESTER_START', description: 'Welcome and orientation for all new and returning students.' },
  { id: 'e2', title: 'Library Information Literacy Workshop', date: '2025-03-05', type: 'LIBRARY_EVENT', description: 'Learn how to use digital repositories and e-resources effectively.' },
  { id: 'e3', title: 'Mid-Semester Break', date: '2025-04-10', type: 'HOLIDAY', description: 'Short break for students and staff.' },
  { id: 'e4', title: 'Final Examination Period', date: '2025-06-01', type: 'EXAM', description: 'Library hours extended to 24/7 during this period.' },
  { id: 'e5', title: 'BBUC Annual Book Fair', date: '2025-03-20', type: 'LIBRARY_EVENT', description: 'Local and international publishers showcasing academic works.' }
];

export const MOCK_BOOKS: Book[] = [
  // --- Information Technology (IT) ---
  { id: 'it1', title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Programming', department: 'IT', course: 'Information Technology', coverUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400', description: 'The fundamental principles of writing readable and maintainable software.', status: BookStatus.AVAILABLE, publishYear: 2008, academicYear: 'Year 1' },
  { id: 'it2', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', isbn: '978-0262033848', category: 'Computer Science', department: 'IT', course: 'Information Technology', coverUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=400', description: 'The comprehensive guide to algorithm design and complexity analysis.', status: BookStatus.BORROWED, publishYear: 2009, academicYear: 'Year 2' },
  { id: 'it3', title: 'Modern Operating Systems', author: 'Andrew S. Tanenbaum', isbn: '978-0133591620', category: 'Systems', department: 'IT', course: 'Information Technology', coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=400', description: 'A detailed look at the internal workings of modern OS environments.', status: BookStatus.AVAILABLE, publishYear: 2014, academicYear: 'Year 2' },
  { id: 'it4', title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0073523323', category: 'Databases', department: 'IT', course: 'Information Technology', coverUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=400', description: 'Essential theories and implementation strategies for database management.', status: BookStatus.AVAILABLE, publishYear: 2019, academicYear: 'Year 1' },
  { id: 'it5', title: 'Networking: A Top-Down Approach', author: 'James Kurose', isbn: '978-0133937633', category: 'Networks', department: 'IT', course: 'Information Technology', coverUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400', description: 'Understanding global connectivity from the application layer down.', status: BookStatus.AVAILABLE, publishYear: 2020, academicYear: 'Year 3' },

  // --- Theology & Divinity ---
  { id: 'th1', title: 'Systematic Theology: An Introduction to Biblical Doctrine', author: 'Wayne Grudem', isbn: '978-0310286707', category: 'Theology', department: 'Theology', course: 'Theology & Divinity', coverUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=400', description: 'A modern classic providing a rigorous look at biblical teaching.', status: BookStatus.AVAILABLE, publishYear: 1994, academicYear: 'Year 1' },
  { id: 'th2', title: 'Old Testament Survey', author: 'Paul R. House', isbn: '978-0805410754', category: 'Biblical Studies', department: 'Theology', course: 'Theology & Divinity', coverUrl: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=400', description: 'Comprehensive analysis of the historical and prophetic Old Testament books.', status: BookStatus.AVAILABLE, publishYear: 1992, academicYear: 'Year 1' },
  { id: 'th3', title: 'New Testament Survey', author: 'Merrill C. Tenney', isbn: '978-0802834072', category: 'Biblical Studies', department: 'Theology', course: 'Theology & Divinity', coverUrl: 'https://images.unsplash.com/photo-1490127252417-7c393f993ee4?q=80&w=400', description: 'Exploring the cultural and spiritual context of the New Testament era.', status: BookStatus.BORROWED, publishYear: 1985, academicYear: 'Year 2' },
  { id: 'th4', title: 'The Story of Christianity: Volume 1', author: 'Justo L. Gonzalez', isbn: '978-0061855887', category: 'Church History', department: 'Theology', course: 'Theology & Divinity', coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400', description: 'The early years of the Christian movement from the Apostles to the Reformation.', status: BookStatus.AVAILABLE, publishYear: 2010, academicYear: 'Year 2' },
  { id: 'th5', title: 'Christian Apologetics', author: 'Douglas Groothuis', isbn: '978-0830839353', category: 'Apologetics', department: 'Theology', course: 'Theology & Divinity', coverUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400', description: 'A comprehensive case for biblical faith in a pluralistic world.', status: BookStatus.AVAILABLE, publishYear: 2011, academicYear: 'Year 3' },

  // --- Business Administration ---
  { id: 'ba1', title: 'Principles of Marketing', author: 'Philip Kotler', isbn: '978-0134492452', category: 'Marketing', department: 'Business', course: 'Business Administration', coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400', description: 'Understanding consumer value and building profitable relationships.', status: BookStatus.AVAILABLE, publishYear: 2017, academicYear: 'Year 1' },
  { id: 'ba2', title: 'Financial Accounting', author: 'Jerry J. Weygandt', isbn: '978-1119503583', category: 'Accounting', department: 'Business', course: 'Business Administration', coverUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400', description: 'The core principles of recording, analyzing, and reporting financial data.', status: BookStatus.BORROWED, publishYear: 2019, academicYear: 'Year 1' },
  { id: 'ba3', title: 'Organizational Behavior', author: 'Stephen P. Robbins', isbn: '978-0134103983', category: 'Management', department: 'Business', course: 'Business Administration', coverUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400', description: 'How individuals and groups behave within organized environments.', status: BookStatus.AVAILABLE, publishYear: 2016, academicYear: 'Year 2' },
  { id: 'ba4', title: 'Operations Management', author: 'Jay Heizer', isbn: '978-0134130422', category: 'Operations', department: 'Business', course: 'Business Administration', coverUrl: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=400', description: 'Design, execution, and control of operations that produce goods.', status: BookStatus.AVAILABLE, publishYear: 2017, academicYear: 'Year 3' },
  { id: 'ba5', title: 'Strategic Management: Concepts', author: 'Fred R. David', isbn: '978-0134153971', category: 'Strategy', department: 'Business', course: 'Business Administration', coverUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400', description: 'Formulation, implementation, and evaluation of cross-functional decisions.', status: BookStatus.RESERVED, publishYear: 2016, academicYear: 'Year 3' },

  // --- Education ---
  { id: 'ed1', title: 'How People Learn', author: 'John D. Bransford', isbn: '978-0309070362', category: 'Pedagogy', department: 'Education', course: 'Education', coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400', description: 'Brain, mind, experience, and school: An updated research perspective.', status: BookStatus.AVAILABLE, publishYear: 2000, academicYear: 'Year 1' },
  { id: 'ed2', title: 'Educational Psychology', author: 'Anita Woolfolk', isbn: '978-0134013527', category: 'Psychology', department: 'Education', course: 'Education', coverUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400', description: 'Applying psychological principles to the classroom environment.', status: BookStatus.AVAILABLE, publishYear: 2015, academicYear: 'Year 1' },
  { id: 'ed3', title: 'Classroom Management', author: 'C.M. Evertson', isbn: '978-0134028385', category: 'Management', department: 'Education', course: 'Education', coverUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400', description: 'Strategies for creating a productive learning environment for students.', status: BookStatus.AVAILABLE, publishYear: 2016, academicYear: 'Year 2' },
  { id: 'ed4', title: 'Curriculum Development', author: 'Jon Wiles', isbn: '978-0133572322', category: 'Pedagogy', department: 'Education', course: 'Education', coverUrl: 'https://images.unsplash.com/photo-1491843351663-8511e9b6713d?q=80&w=400', description: 'A guide to practice for modern curriculum designers and educators.', status: BookStatus.BORROWED, publishYear: 2014, academicYear: 'Year 3' },
  { id: 'ed5', title: 'Foundations of Education', author: 'Allan C. Ornstein', isbn: '978-1305500983', category: 'Pedagogy', department: 'Education', course: 'Education', coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400', description: 'Exploring the sociological and philosophical roots of teaching.', status: BookStatus.AVAILABLE, publishYear: 2016, academicYear: 'Year 1' },

  // --- Journalism & Media ---
  { id: 'jm1', title: 'The Elements of Journalism', author: 'Bill Kovach', isbn: '978-0804136785', category: 'Media', department: 'Journalism', course: 'Journalism & Media', coverUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400', description: 'What newspeople should know and the public should expect.', status: BookStatus.AVAILABLE, publishYear: 2014, academicYear: 'Year 1' },
  { id: 'jm2', title: 'News Reporting and Writing', author: 'Melvin Mencher', isbn: '978-0073511993', category: 'Reporting', department: 'Journalism', course: 'Journalism & Media', coverUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=400', description: 'The comprehensive guide to professional news gathering and writing.', status: BookStatus.AVAILABLE, publishYear: 2010, academicYear: 'Year 1' },
  { id: 'jm3', title: 'Media Ethics: Issues and Cases', author: 'Philip Patterson', isbn: '978-0073526195', category: 'Ethics', department: 'Journalism', course: 'Journalism & Media', coverUrl: 'https://images.unsplash.com/photo-1585829365234-78d9b81293e7?q=80&w=400', description: 'Moral dilemmas and ethical decision making in the media industry.', status: BookStatus.AVAILABLE, publishYear: 2013, academicYear: 'Year 2' },
  { id: 'jm4', title: 'Broadcast Journalism', author: 'Andrew Boyd', isbn: '978-0240526379', category: 'Broadcast', department: 'Journalism', course: 'Journalism & Media', coverUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=400', description: 'Techniques of radio and television news reporting.', status: BookStatus.AVAILABLE, publishYear: 2012, academicYear: 'Year 2' },
  { id: 'jm5', title: 'Digital Journalism', author: 'Janet Jones', isbn: '978-1446207352', category: 'Digital', department: 'Journalism', course: 'Journalism & Media', coverUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=400', description: 'New technologies and the transformation of news in the digital age.', status: BookStatus.RESERVED, publishYear: 2011, academicYear: 'Year 3' },

  // --- Social Work ---
  { id: 'sw1', title: 'Social Psychology', author: 'Elliot Aronson', isbn: '978-0134641287', category: 'Sociology', department: 'Social Sciences', course: 'Social Work', coverUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400', description: 'How we think about, influence, and relate to one another.', status: BookStatus.AVAILABLE, publishYear: 2018, academicYear: 'Year 1' },
  { id: 'sw2', title: 'Direct Social Work Practice', author: 'Dean H. Hepworth', isbn: '978-1305633803', category: 'Practice', department: 'Social Sciences', course: 'Social Work', coverUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2959210?q=80&w=400', description: 'Theory and skills for direct intervention with individuals and families.', status: BookStatus.AVAILABLE, publishYear: 2016, academicYear: 'Year 2' },
  { id: 'sw3', title: 'Social Welfare Policy', author: 'Bruce S. Jansson', isbn: '978-1305101661', category: 'Policy', department: 'Social Sciences', course: 'Social Work', coverUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=400', description: 'Analyzing the social welfare system and policy advocacy.', status: BookStatus.BORROWED, publishYear: 2015, academicYear: 'Year 2' },
  { id: 'sw4', title: 'Human Behavior in the Environment', author: 'Elizabeth D. Hutchison', isbn: '978-1483317458', category: 'Sociology', department: 'Social Sciences', course: 'Social Work', coverUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400', description: 'The multidimensional perspective on human behavior.', status: BookStatus.AVAILABLE, publishYear: 2014, academicYear: 'Year 1' },
  { id: 'sw5', title: 'Research Methods for Social Work', author: 'Allen Rubin', isbn: '978-1305101548', category: 'Research', department: 'Social Sciences', course: 'Social Work', coverUrl: 'https://images.unsplash.com/photo-1454165833767-13143574296c?q=80&w=400', description: 'The fundamental techniques of inquiry in the social work field.', status: BookStatus.AVAILABLE, publishYear: 2016, academicYear: 'Year 3' },

  // --- Public Administration ---
  { id: 'pa1', title: 'Public Administration: Concepts', author: 'Richard J. Stillman', isbn: '978-0618993017', category: 'Theory', department: 'Social Sciences', course: 'Public Administration', coverUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=400', description: 'Introduction to the theories and processes of public management.', status: BookStatus.AVAILABLE, publishYear: 2009, academicYear: 'Year 1' },
  { id: 'pa2', title: 'The Ethics of Management', author: 'LaRue Tone Hosmer', isbn: '978-0073530222', category: 'Ethics', department: 'Social Sciences', course: 'Public Administration', coverUrl: 'https://images.unsplash.com/photo-1548263514-a2388c5d5f82?q=80&w=400', description: 'Understanding moral responsibility in public and private leadership.', status: BookStatus.AVAILABLE, publishYear: 2010, academicYear: 'Year 2' },
  { id: 'pa3', title: 'Public Personnel Management', author: 'Donald Klingner', isbn: '978-0205716500', category: 'Management', department: 'Social Sciences', course: 'Public Administration', coverUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=400', description: 'Managing human resources in the public and non-profit sectors.', status: BookStatus.AVAILABLE, publishYear: 2010, academicYear: 'Year 2' },
  { id: 'pa4', title: 'Public Budgeting Systems', author: 'Robert D. Lee', isbn: '978-0763746681', category: 'Finance', department: 'Social Sciences', course: 'Public Administration', coverUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=400', description: 'Analyzing the complex fiscal processes of government agencies.', status: BookStatus.BORROWED, publishYear: 2012, academicYear: 'Year 3' },
  { id: 'pa5', title: 'Bureaucracy and Representative Government', author: 'William A. Niskanen', isbn: '978-0202302195', category: 'Politics', department: 'Social Sciences', course: 'Public Administration', coverUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=400', description: 'Economic models of bureaucracy and political behavior.', status: BookStatus.AVAILABLE, publishYear: 2007, academicYear: 'Year 3' }
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
  )
};
