import { Role, Section, QuestionType, Difficulty, TestStatus, ActivityType } from '@prisma/client';

export { Role, Section, QuestionType, Difficulty, TestStatus, ActivityType };

// User types
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: Role;
    createdAt: Date;
}

export interface UserStats {
    totalTests: number;
    completedTests: number;
    highestScore: number;
    averageScore: number;
    lastTestDate?: Date;
    sectionAverages: {
        listening: number;
        structure: number;
        reading: number;
    };
}

// Question types
export interface QuestionData {
    id: string;
    section: Section;
    questionType: QuestionType;
    questionText: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    difficulty: Difficulty;
    audioUrl?: string;
    passageId?: string;
}

export interface PassageData {
    id: string;
    title: string;
    content: string;
    paragraphs: string[];
}

// Test types
export interface TestSessionData {
    id: string;
    status: TestStatus;
    currentSection: Section;
    startedAt: Date;
    finishedAt?: Date;
    scores?: {
        listeningRaw?: number;
        structureRaw?: number;
        readingRaw?: number;
        listeningScore?: number;
        structureScore?: number;
        readingScore?: number;
        totalScore?: number;
    };
}

export interface AnswerData {
    questionId: string;
    selectedAnswer: number;
}

export interface TestResult {
    testId: string;
    completedAt: Date;
    listeningRaw: number;
    structureRaw: number;
    readingRaw: number;
    listeningScore: number;
    structureScore: number;
    readingScore: number;
    totalScore: number;
    sections: {
        listening: { correct: number; total: number };
        structure: { correct: number; total: number };
        reading: { correct: number; total: number };
    };
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Admin stats types
export interface AdminOverviewStats {
    totalQuestions: number;
    totalUsers: number;
    testsToday: number;
    averageScore: number;
}

export interface TestsPerDayData {
    date: string;
    count: number;
}

export interface ScoreDistributionData {
    range: string;
    count: number;
}
