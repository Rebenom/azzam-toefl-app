import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@toefl.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@toefl.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create test user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'user@toefl.com' },
        update: {},
        create: {
            name: 'Test User',
            email: 'user@toefl.com',
            password: userPassword,
            role: 'USER',
        },
    });
    console.log('✅ Test user created:', user.email);

    // Create a reading passage
    const passage = await prisma.passage.create({
        data: {
            title: 'The Evolution of Digital Technology',
            content: 'In the past few decades, digital technology has transformed every aspect of modern life...',
            paragraphs: [
                '[1] In the past few decades, digital technology has transformed every aspect of modern life. From the way we communicate to how we conduct business, the digital revolution has been nothing short of dramatic. The advent of the internet, in particular, has created a globally connected world where information flows freely and instantaneously.',
                '[2] The most dramatic changes have occurred in the field of communication. Where once people relied on letters that took days or weeks to arrive, now messages can be sent and received in milliseconds. Social media platforms have redefined how we maintain relationships, share experiences, and even consume news.',
                '[3] However, this technological transformation has not been without its challenges. Issues of privacy, security, and the digital divide continue to pose significant concerns for societies worldwide. As we become increasingly dependent on digital systems, the vulnerabilities of these systems become more apparent.',
            ],
        },
    });
    console.log('✅ Reading passage created:', passage.title);

    // Create sample questions for each section
    // LISTENING questions
    const listeningQuestions = [
        {
            section: 'LISTENING' as const,
            questionType: 'MAIN_IDEA' as const,
            questionText: 'What is the main topic of the conversation?',
            options: ['The history of the university', 'Course registration procedures', 'Campus facilities and services', 'Student housing options'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'DETAIL' as const,
            questionText: 'What does the professor mainly discuss?',
            options: ['The evolution of digital technology', 'Environmental conservation methods', 'Ancient architectural techniques', 'Modern economic theories'],
            correctAnswer: 0,
            difficulty: 'MEDIUM' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'INFERENCE' as const,
            questionText: 'According to the speaker, what is the primary benefit?',
            options: ['Reduced operational costs', 'Improved efficiency', 'Better customer satisfaction', 'Increased market share'],
            correctAnswer: 1,
            difficulty: 'HARD' as const,
        },
    ];

    // STRUCTURE questions
    const structureQuestions = [
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: 'The committee _______ the proposal before the deadline was extended.',
            options: ['has reviewed', 'had reviewed', 'reviewed', 'was reviewing'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: 'Neither the students nor the teacher _______ aware of the schedule change.',
            options: ['were', 'was', 'are', 'have been'],
            correctAnswer: 1,
            difficulty: 'EASY' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: '_______ the rain, the outdoor event was not canceled.',
            options: ['Despite of', 'In spite of', 'Although', 'However'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
        },
    ];

    // READING questions (linked to passage)
    const readingQuestions = [
        {
            section: 'READING' as const,
            questionType: 'MAIN_IDEA' as const,
            questionText: 'What is the main topic of the passage?',
            options: ['The history of communication methods', 'The impact of digital technology on modern life', 'The challenges of social media', 'The future of the internet'],
            correctAnswer: 1,
            difficulty: 'EASY' as const,
            passageId: passage.id,
        },
        {
            section: 'READING' as const,
            questionType: 'VOCABULARY' as const,
            questionText: 'The word "dramatic" in paragraph 2 is closest in meaning to:',
            options: ['theatrical', 'significant', 'sudden', 'dangerous'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
            passageId: passage.id,
        },
        {
            section: 'READING' as const,
            questionType: 'FACTUAL' as const,
            questionText: 'According to paragraph 3, what is a concern about digital technology?',
            options: ['It is too expensive', 'It is difficult to use', 'Privacy and security issues', 'It is not widely available'],
            correctAnswer: 2,
            difficulty: 'MEDIUM' as const,
            passageId: passage.id,
        },
    ];

    // Create all questions
    for (const q of [...listeningQuestions, ...structureQuestions, ...readingQuestions]) {
        await prisma.question.create({ data: q });
    }
    console.log('✅ Sample questions created:', listeningQuestions.length + structureQuestions.length + readingQuestions.length);

    // Create initial activity log
    await prisma.activityLog.create({
        data: {
            type: 'USER_REGISTERED',
            message: 'Admin account created',
            metadata: { userId: admin.id },
        },
    });

    console.log('🎉 Database seeding completed!');
    console.log('');
    console.log('You can now login with:');
    console.log('  Admin: admin@toefl.com / admin123');
    console.log('  User:  user@toefl.com / user123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
