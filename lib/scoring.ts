import { Section } from '@prisma/client';

/**
 * TOEFL PBT Score Conversion
 * 
 * Section scores range from 31-68
 * Total score = (Listening + Structure + Reading) × 10 ÷ 3
 * Total score range: 310-677
 */

// Standard question counts per section
export const SECTION_QUESTION_COUNT = {
    LISTENING: 50,
    STRUCTURE: 40,
    READING: 50,
} as const;

// Section time limits in seconds
export const SECTION_TIME_LIMITS = {
    LISTENING: 35 * 60, // 35 minutes
    STRUCTURE: 25 * 60, // 25 minutes
    READING: 55 * 60,   // 55 minutes
} as const;

/**
 * Convert raw score (number of correct answers) to scaled score (31-68)
 * Uses linear interpolation based on TOEFL PBT conversion tables
 */
export function calculateSectionScore(
    section: Section,
    rawScore: number
): number {
    const totalQuestions = SECTION_QUESTION_COUNT[section];

    // Clamp raw score to valid range
    const clampedRaw = Math.max(0, Math.min(rawScore, totalQuestions));

    // Linear interpolation: 0 correct = 31, all correct = 68
    const percentage = clampedRaw / totalQuestions;
    const scaledScore = Math.round(31 + percentage * 37);

    return scaledScore;
}

/**
 * Calculate total TOEFL score from section scores
 * Formula: (L + S + R) × 10 ÷ 3
 */
export function calculateTotalScore(
    listeningScore: number,
    structureScore: number,
    readingScore: number
): number {
    return Math.round((listeningScore + structureScore + readingScore) * 10 / 3);
}

/**
 * Get score level description
 */
export function getScoreLevel(totalScore: number): {
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    description: string;
} {
    if (totalScore >= 550) {
        return { level: 'EXPERT', description: 'Excellent proficiency' };
    } else if (totalScore >= 500) {
        return { level: 'ADVANCED', description: 'Good proficiency' };
    } else if (totalScore >= 450) {
        return { level: 'INTERMEDIATE', description: 'Moderate proficiency' };
    } else {
        return { level: 'BEGINNER', description: 'Basic proficiency' };
    }
}

/**
 * Calculate all scores from answers
 */
export function calculateAllScores(answers: {
    listening: { correct: number };
    structure: { correct: number };
    reading: { correct: number };
}): {
    listeningRaw: number;
    structureRaw: number;
    readingRaw: number;
    listeningScore: number;
    structureScore: number;
    readingScore: number;
    totalScore: number;
} {
    const listeningRaw = answers.listening.correct;
    const structureRaw = answers.structure.correct;
    const readingRaw = answers.reading.correct;

    const listeningScore = calculateSectionScore('LISTENING', listeningRaw);
    const structureScore = calculateSectionScore('STRUCTURE', structureRaw);
    const readingScore = calculateSectionScore('READING', readingRaw);

    const totalScore = calculateTotalScore(listeningScore, structureScore, readingScore);

    return {
        listeningRaw,
        structureRaw,
        readingRaw,
        listeningScore,
        structureScore,
        readingScore,
        totalScore,
    };
}
