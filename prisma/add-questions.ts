import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Adding more TOEFL questions...');

    // ============================================
    // LISTENING QUESTIONS (20 more)
    // ============================================
    const listeningQuestions = [
        {
            section: 'LISTENING' as const,
            questionType: 'MAIN_IDEA' as const,
            questionText: 'What is the conversation mainly about?',
            options: ['Registering for classes', 'Finding a part-time job', 'Joining a study group', 'Choosing a major'],
            correctAnswer: 0,
            difficulty: 'EASY' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'DETAIL' as const,
            questionText: 'According to the professor, when did the Industrial Revolution begin?',
            options: ['Early 17th century', 'Mid 18th century', 'Late 19th century', 'Early 20th century'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'INFERENCE' as const,
            questionText: 'What can be inferred about the student from the conversation?',
            options: ['She missed the previous lecture', 'She is a graduate student', 'She disagrees with the professor', 'She has experience in research'],
            correctAnswer: 0,
            difficulty: 'HARD' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'ATTITUDE' as const,
            questionText: 'What is the professor\'s attitude toward the new research findings?',
            options: ['Skeptical', 'Enthusiastic', 'Indifferent', 'Disappointed'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'MAIN_IDEA' as const,
            questionText: 'What is the lecture mainly about?',
            options: ['The causes of climate change', 'Effects of deforestation', 'Renewable energy sources', 'Water pollution'],
            correctAnswer: 2,
            difficulty: 'EASY' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'DETAIL' as const,
            questionText: 'What does the speaker say about solar panels?',
            options: ['They are too expensive', 'They are becoming more efficient', 'They only work in summer', 'They require constant maintenance'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'INFERENCE' as const,
            questionText: 'What does the professor imply about the experiment?',
            options: ['It was unsuccessful', 'It needs to be repeated', 'It confirmed the hypothesis', 'It was too expensive'],
            correctAnswer: 2,
            difficulty: 'HARD' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'DETAIL' as const,
            questionText: 'According to the conversation, what should the student do first?',
            options: ['Submit the application', 'Talk to the advisor', 'Pay the fee', 'Attend orientation'],
            correctAnswer: 1,
            difficulty: 'EASY' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'MAIN_IDEA' as const,
            questionText: 'What is the main purpose of the announcement?',
            options: ['To introduce new faculty', 'To announce schedule changes', 'To explain library rules', 'To promote a campus event'],
            correctAnswer: 3,
            difficulty: 'EASY' as const,
        },
        {
            section: 'LISTENING' as const,
            questionType: 'ATTITUDE' as const,
            questionText: 'How does the student feel about the assignment?',
            options: ['Confident', 'Overwhelmed', 'Bored', 'Angry'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
        },
    ];

    // ============================================
    // STRUCTURE QUESTIONS (20 more)
    // ============================================
    const structureQuestions = [
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: 'The professor, along with her students, _______ attending the conference next week.',
            options: ['is', 'are', 'were', 'have been'],
            correctAnswer: 0,
            difficulty: 'MEDIUM' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: '_______ the weather improves, the outdoor ceremony will be held indoors.',
            options: ['Unless', 'If', 'When', 'Because'],
            correctAnswer: 0,
            difficulty: 'EASY' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'ERROR_IDENTIFICATION' as const,
            questionText: 'Not only the students but also the teacher _______ surprised by the test results.',
            options: ['was', 'were', 'is being', 'have been'],
            correctAnswer: 0,
            difficulty: 'HARD' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: 'Had I known about the traffic, I _______ earlier.',
            options: ['would leave', 'would have left', 'will leave', 'had left'],
            correctAnswer: 1,
            difficulty: 'HARD' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: 'The book _______ by the famous author was published last year.',
            options: ['writing', 'written', 'wrote', 'to write'],
            correctAnswer: 1,
            difficulty: 'EASY' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: 'She suggested that he _______ the doctor immediately.',
            options: ['sees', 'saw', 'see', 'seeing'],
            correctAnswer: 2,
            difficulty: 'MEDIUM' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: '_______ hard she tried, she could not solve the problem.',
            options: ['However', 'Whatever', 'Whenever', 'Wherever'],
            correctAnswer: 0,
            difficulty: 'MEDIUM' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: 'The more you practice, _______ you will become.',
            options: ['the better', 'better', 'the best', 'good'],
            correctAnswer: 0,
            difficulty: 'EASY' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: 'By the time we arrived, the movie _______.',
            options: ['already started', 'had already started', 'has already started', 'was already starting'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
        },
        {
            section: 'STRUCTURE' as const,
            questionType: 'SENTENCE_COMPLETION' as const,
            questionText: 'If I _______ you, I would accept the offer.',
            options: ['am', 'was', 'were', 'be'],
            correctAnswer: 2,
            difficulty: 'EASY' as const,
        },
    ];

    // ============================================
    // READING PASSAGE & QUESTIONS
    // ============================================

    // Create a new passage
    const passage = await prisma.passage.create({
        data: {
            title: 'The History of the Internet',
            content: 'The Internet has revolutionized global communication...',
            paragraphs: [
                '[1] The Internet has revolutionized global communication in ways that were unimaginable just a few decades ago. What began as a military project in the 1960s has evolved into an essential tool for education, commerce, and social interaction. The Advanced Research Projects Agency Network (ARPANET), funded by the U.S. Department of Defense, is widely considered the precursor to the modern Internet.',
                '[2] The development of the World Wide Web in 1989 by Tim Berners-Lee marked a crucial turning point. By creating a system of hyperlinked documents accessible via the Internet, Berners-Lee made it possible for ordinary users to navigate and share information with unprecedented ease. This innovation transformed the Internet from a specialized tool for researchers into a global phenomenon.',
                '[3] Today, the Internet connects billions of people worldwide. It has transformed industries, created new forms of entertainment, and changed the way we work and learn. However, it has also raised significant concerns about privacy, security, and the spread of misinformation. As we move forward, society must grapple with these challenges while continuing to harness the Internet\'s potential for positive change.',
            ],
        },
    });

    const readingQuestions = [
        {
            section: 'READING' as const,
            questionType: 'MAIN_IDEA' as const,
            questionText: 'What is the main idea of the passage?',
            options: [
                'The Internet was invented by the military',
                'The Internet has profoundly changed global communication',
                'Tim Berners-Lee is the father of the Internet',
                'The Internet is dangerous'
            ],
            correctAnswer: 1,
            difficulty: 'EASY' as const,
            passageId: passage.id,
        },
        {
            section: 'READING' as const,
            questionType: 'VOCABULARY' as const,
            questionText: 'The word "precursor" in paragraph 1 is closest in meaning to:',
            options: ['successor', 'forerunner', 'competitor', 'alternative'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
            passageId: passage.id,
        },
        {
            section: 'READING' as const,
            questionType: 'FACTUAL' as const,
            questionText: 'According to paragraph 2, what did Tim Berners-Lee create?',
            options: ['ARPANET', 'The first computer', 'The World Wide Web', 'Email'],
            correctAnswer: 2,
            difficulty: 'EASY' as const,
            passageId: passage.id,
        },
        {
            section: 'READING' as const,
            questionType: 'INFERENCE' as const,
            questionText: 'What can be inferred from paragraph 3?',
            options: [
                'The Internet has no negative effects',
                'The Internet will be replaced soon',
                'We need to address challenges while using the Internet',
                'The Internet is only used for entertainment'
            ],
            correctAnswer: 2,
            difficulty: 'HARD' as const,
            passageId: passage.id,
        },
        {
            section: 'READING' as const,
            questionType: 'REFERENCE' as const,
            questionText: 'In paragraph 2, "This innovation" refers to:',
            options: ['ARPANET', 'The World Wide Web', 'The U.S. Department of Defense', 'Global communication'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
            passageId: passage.id,
        },
        {
            section: 'READING' as const,
            questionType: 'NEGATIVE_FACTUAL' as const,
            questionText: 'According to the passage, all of the following are concerns about the Internet EXCEPT:',
            options: ['Privacy issues', 'Security problems', 'Misinformation', 'High costs'],
            correctAnswer: 3,
            difficulty: 'HARD' as const,
            passageId: passage.id,
        },
        {
            section: 'READING' as const,
            questionType: 'VOCABULARY' as const,
            questionText: 'The phrase "grapple with" in paragraph 3 is closest in meaning to:',
            options: ['ignore', 'deal with', 'celebrate', 'create'],
            correctAnswer: 1,
            difficulty: 'MEDIUM' as const,
            passageId: passage.id,
        },
        {
            section: 'READING' as const,
            questionType: 'FACTUAL' as const,
            questionText: 'When was ARPANET developed?',
            options: ['1950s', '1960s', '1970s', '1980s'],
            correctAnswer: 1,
            difficulty: 'EASY' as const,
            passageId: passage.id,
        },
    ];

    // Insert all questions
    let totalCreated = 0;

    for (const q of listeningQuestions) {
        await prisma.question.create({ data: q });
        totalCreated++;
    }
    console.log(`✅ Created ${listeningQuestions.length} Listening questions`);

    for (const q of structureQuestions) {
        await prisma.question.create({ data: q });
        totalCreated++;
    }
    console.log(`✅ Created ${structureQuestions.length} Structure questions`);

    for (const q of readingQuestions) {
        await prisma.question.create({ data: q });
        totalCreated++;
    }
    console.log(`✅ Created ${readingQuestions.length} Reading questions`);
    console.log(`✅ Created 1 new passage: "${passage.title}"`);

    console.log('');
    console.log(`🎉 Total new questions added: ${totalCreated}`);
    console.log('');

    // Show totals
    const totals = await prisma.question.groupBy({
        by: ['section'],
        _count: { id: true },
    });

    console.log('📊 Total questions in database:');
    for (const t of totals) {
        console.log(`   ${t.section}: ${t._count.id} questions`);
    }
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
