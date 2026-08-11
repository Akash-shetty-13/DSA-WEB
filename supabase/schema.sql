-- DSA Mastery Tracker PostgreSQL Schema for Supabase

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROBLEMS TABLE (Shared / Read-Only Metadata)
CREATE TABLE IF NOT EXISTS public.problems (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    leetcode_number INT,
    url TEXT,
    leetcode_url TEXT,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Unknown')) DEFAULT 'Medium',
    category TEXT NOT NULL,
    sub_pattern TEXT,
    primary_pattern TEXT NOT NULL,
    secondary_patterns TEXT[] DEFAULT '{}',
    source TEXT NOT NULL, -- 'custom', 'risingbrain', 'both'
    sources TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    youtube_url TEXT,
    practice_url TEXT,
    companies JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROGRESS TABLE (Private User Data)
CREATE TABLE IF NOT EXISTS public.user_problem_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('Not Started', 'In Progress', 'Solved', 'Needs Revision', 'Mastered', 'Previously Solved')) DEFAULT 'Not Started',
    is_solved BOOLEAN DEFAULT FALSE,
    solved_date TIMESTAMPTZ,
    attempts INT DEFAULT 0,
    time_taken INT DEFAULT 0, -- minutes
    confidence INT CHECK (confidence BETWEEN 0 AND 5) DEFAULT 0,
    needs_revision BOOLEAN DEFAULT FALSE,
    revision_date TIMESTAMPTZ,
    last_reviewed TIMESTAMPTZ,
    review_count INT DEFAULT 0,
    notes TEXT DEFAULT '',
    solution_notes JSONB DEFAULT '{"approach":"","algorithm":"","timeComplexity":"","spaceComplexity":"","mistakes":"","keyInsight":""}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

-- 3. REVISION HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.revision_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    reviewed_at TIMESTAMPTZ DEFAULT NOW(),
    interval_days INT NOT NULL, -- 1, 3, 7, 14, 30
    confidence_before INT,
    confidence_after INT,
    revision_notes TEXT DEFAULT '',
    time_spent INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DAILY ACTIVITY TRACKER
CREATE TABLE IF NOT EXISTS public.daily_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    problems_solved INT DEFAULT 0,
    study_time INT DEFAULT 0, -- total minutes
    target_goal INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 5. PRACTICE SESSIONS (Learning Mode)
CREATE TABLE IF NOT EXISTS public.practice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pattern TEXT NOT NULL,
    difficulty TEXT,
    total_questions INT NOT NULL,
    solved_questions INT DEFAULT 0,
    skipped_questions INT DEFAULT 0,
    avg_confidence NUMERIC(3,2) DEFAULT 0.0,
    time_spent INT DEFAULT 0, -- seconds
    status TEXT CHECK (status IN ('in_progress', 'completed')) DEFAULT 'in_progress',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USER SETTINGS
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_goal INT DEFAULT 3,
    theme TEXT CHECK (theme IN ('dark', 'light', 'system')) DEFAULT 'dark',
    default_difficulty TEXT DEFAULT 'All',
    default_pattern TEXT DEFAULT 'All',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_problems_title ON public.problems(title);
CREATE INDEX IF NOT EXISTS idx_problems_leetcode_number ON public.problems(leetcode_number);
CREATE INDEX IF NOT EXISTS idx_problems_primary_pattern ON public.problems(primary_pattern);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_category ON public.problems(category);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.user_problem_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_problem_id ON public.user_problem_progress(problem_id);
CREATE INDEX IF NOT EXISTS idx_progress_status ON public.user_problem_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_progress_solved_date ON public.user_problem_progress(user_id, solved_date);
CREATE INDEX IF NOT EXISTS idx_progress_revision_date ON public.user_problem_progress(user_id, revision_date);

CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON public.daily_activity(user_id, date);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_problem_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Problems: Shared Read-only for authenticated users
CREATE POLICY "Allow public read access to problems"
    ON public.problems FOR SELECT
    USING (true);

-- Progress: Private to User
CREATE POLICY "Users can view their own progress"
    ON public.user_problem_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
    ON public.user_problem_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
    ON public.user_problem_progress FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
    ON public.user_problem_progress FOR DELETE
    USING (auth.uid() = user_id);

-- Revision History: Private to User
CREATE POLICY "Users can view their own revision history"
    ON public.revision_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own revision history"
    ON public.revision_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Daily Activity: Private to User
CREATE POLICY "Users can view their own daily activity"
    ON public.daily_activity FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own daily activity"
    ON public.daily_activity FOR ALL
    USING (auth.uid() = user_id);

-- Practice Sessions: Private to User
CREATE POLICY "Users can view their practice sessions"
    ON public.practice_sessions FOR ALL
    USING (auth.uid() = user_id);

-- User Settings: Private to User
CREATE POLICY "Users can manage their settings"
    ON public.user_settings FOR ALL
    USING (auth.uid() = user_id);
