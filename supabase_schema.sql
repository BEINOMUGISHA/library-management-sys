
-- BBUC Library Management System - Database Schema
-- Paste this into the Supabase SQL Editor (https://app.supabase.com)

-- CUSTOM ENUMS
CREATE TYPE user_role AS ENUM ('STUDENT', 'LECTURER', 'ADMIN');
CREATE TYPE book_status AS ENUM ('AVAILABLE', 'BORROWED', 'RESERVED');

-- TABLES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'STUDENT',
    avatar TEXT,
    department TEXT,
    "libraryCard" JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    department TEXT NOT NULL,
    course TEXT NOT NULL,
    "coverUrl" TEXT,
    description TEXT,
    status book_status DEFAULT 'AVAILABLE',
    "publishYear" INTEGER,
    academic_year TEXT, -- Added for curriculum year filtering
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.borrow_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "bookId" UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    "borrowDate" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "returnDate" TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "bookId" UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    "reservationDate" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "expiryDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS & REALTIME
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrow_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.books;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.borrow_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
