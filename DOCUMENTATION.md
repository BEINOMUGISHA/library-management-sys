# BBUC Library Management System - Documentation

## 1. System Overview
The **BBUC Library Management System** is a comprehensive eLibrary ecosystem designed specifically for **Bishop Barham University College (BBUC)**. It integrates traditional library management with modern digital resource allocation and AI-powered academic assistance.

### Key Objectives:
- Streamline the borrowing and returning process for physical and digital resources.
- Provide real-time availability tracking of library assets.
- Offer AI-driven research assistance to students and faculty.
- Manage institutional policies regarding resource allocation.

---

## 2. Technical Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS.
- **Routing:** React Router 7.
- **Backend/Database:** Supabase (PostgreSQL with Real-time capabilities).
- **AI Integration:** Google Gemini 3 Flash (via `@google/genai`).
- **Icons:** Custom SVG Icon set (defined in `constants.tsx`).
- **Styling:** Tailwind CSS with a custom "BBUC" theme (Navy, Gold, Action Indigo).

---

## 3. Core Features

### 3.1 User Roles & Permissions
The system supports three distinct roles, each with specific borrowing limits:
- **STUDENT:** Limit of **3 books**.
- **LECTURER:** Limit of **7 books**.
- **ADMIN:** Limit of **10 books** (and full system management).

### 3.2 Resource Catalog
Supports multiple resource types:
- **PHYSICAL:** Traditional library books.
- **EBOOK:** Digital books with PDF access.
- **JOURNAL:** Academic publications.
- **THESIS:** Student and faculty research papers.

### 3.3 AI Virtual Librarian
The **BBUC Virtual Librarian** (powered by Gemini AI) provides:
- **Catalog Context:** Answers questions about books available in the local BBUC collection.
- **External Research:** Uses Google Search grounding to find reputable academic sources beyond the local catalog.
- **Personalized Recommendations:** Suggests genres and books based on user interests.
- **Voice Interaction:** Supports microphone input for hands-free academic queries (requires browser permission).

### 3.4 Admin Dashboard
Administrators can:
- **Database Status Monitoring:** Real-time indicator showing if the system is connected to a live Supabase instance or running in "Mock Mode."
- **Institutional Identity Management:** Issue and manage digital **Library Cards** with unique card numbers.
- **Resource Control:** Toggle book availability (Available vs Restricted) and manage status badges.
- **Member Control Center:** Update user profiles, departments, and academic roles via a secure administrative interface.

### 3.5 Catalog & Search
The catalog features an advanced filtering system:
- **Smart Search:** Real-time suggestions with keyword highlighting.
- **Multi-dimensional Filtering:** Filter by Resource Type (Ebook, Journal, Thesis, Physical), Department, Course Curriculum, and Academic Year.
- **Sorting:** Sort resources by Title, Author, Publish Year, or Type.
- **Digital Access:** Direct "Read Online" capability for e-resources.

### 3.6 Academic Calendar
A dedicated interface for tracking institutional timelines:
- **Examination Periods:** 24/7 digital portal support during exams.
- **Semester Cycles:** Tracking start and end dates for academic terms.
- **Library Events:** Digital literacy workshops and orientation sessions.

---

## 4. Database Schema (Supabase)
The system uses a relational schema in Supabase:
- `profiles`: User information, roles, and library card data.
- `books`: Catalog items including metadata and digital resource links.
- `borrow_records`: Tracking of active and historical loans.
- `reservations`: Managing holds on popular items.

---

## 5. System Architecture

### State Management
The application uses a custom hook `useLibraryState.ts` which:
1. Synchronizes data from Supabase on load.
2. Listens for real-time changes using Supabase Broadcast/Presence.
3. Provides a unified `actions` object for all library operations (borrow, return, reserve, etc.).
4. Falls back to **Mock Mode** if Supabase environment variables are missing, ensuring the UI remains functional for demos.

### AI Service
The `geminiService.ts` handles communication with the Google Gemini API. It is configured with a system instruction that enforces the persona of a "Professional BBUC Librarian."

---

## 6. Institutional Policies
- **Borrowing Limit:** Enforced at the application level based on `UserRole`.
- **Card Expiry:** Library cards have issue and expiry dates managed by admins.
- **Academic Year:** Resources are categorized by academic year (Year 1, Year 2, etc.) to help students find relevant curriculum materials.

---

## 7. Installation & Setup
1. **Environment Variables:**
   - `GEMINI_API_KEY`: Required for the Virtual Librarian.
   - `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Required for live database synchronization.
2. **Database Setup:**
   - Execute the `supabase_schema.sql` in the Supabase SQL Editor.
3. **Run Development:**
   - `npm run dev` (Starts the Vite server on port 3000).

---

## 8. Future Roadmap
- Integration with institutional SSO (Single Sign-On).
- Automated fine calculation for overdue books.
- Mobile application for barcode scanning of physical books.
- Offline mode for digital resource reading.
