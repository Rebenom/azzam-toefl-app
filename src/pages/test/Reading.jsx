import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { useTest } from '../../contexts/TestContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const samplePassage = {
    title: 'The Evolution of Digital Technology',
    paragraphs: [
        '[1] In the past few decades, digital technology has transformed every aspect of modern life. From the way we communicate to how we conduct business, the digital revolution has been nothing short of dramatic. The advent of the internet, in particular, has created a globally connected world where information flows freely and instantaneously.',
        '[2] The most dramatic changes have occurred in the field of communication. Where once people relied on letters that took days or weeks to arrive, now messages can be sent and received in milliseconds. Social media platforms have redefined how we maintain relationships, share experiences, and even consume news.',
        '[3] However, this technological transformation has not been without its challenges. Issues of privacy, security, and the digital divide continue to pose significant concerns for societies worldwide. As we become increasingly dependent on digital systems, the vulnerabilities of these systems become more apparent.',
    ],
};

const sampleQuestions = [
    {
        id: 1,
        question: 'What is the main topic of the passage?',
        options: [
            'The history of communication methods',
            'The impact of digital technology on modern life',
            'The challenges of social media',
            'The future of the internet',
        ],
        correctAnswer: 1,
    },
    {
        id: 2,
        question: 'The word "dramatic" in paragraph 2 is closest in meaning to:',
        options: ['theatrical', 'significant', 'sudden', 'dangerous'],
        correctAnswer: 1,
    },
    {
        id: 3,
        question: 'According to paragraph 3, what is a concern about digital technology?',
        options: [
            'It is too expensive',
            'It is difficult to use',
            'Privacy and security issues',
            'It is not widely available',
        ],
        correctAnswer: 2,
    },
];

export default function Reading() {
    const navigate = useNavigate();
    const { answers, setAnswer, updateRemainingTime, sectionTimes, finishTest } = useTest();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(sectionTimes.reading);

    const questions = sampleQuestions;
    const currentQ = questions[currentQuestion];
    const selectedAnswer = answers.reading[currentQ.id];

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinishTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        updateRemainingTime(timeLeft);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (optionIndex) => {
        setAnswer('reading', currentQ.id, optionIndex);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleFinishTest = () => {
        finishTest();
        navigate('/test/result');
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Keluar Tes</span>
                        </button>

                        <div className="flex items-center gap-2 text-primary-600 font-semibold">
                            <BookOpen className="w-5 h-5" />
                            <span>READING SECTION</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full font-mono font-bold">
                                <Clock className="w-4 h-4" />
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Soal {currentQuestion + 1}/{questions.length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-1 bg-gray-200">
                    <div
                        className="h-full bg-primary-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Passage */}
                        <Card className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                            <div className="flex items-center gap-2 text-primary-600 font-semibold mb-4">
                                <BookOpen className="w-5 h-5" />
                                Reading Passage
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{samplePassage.title}</h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                {samplePassage.paragraphs.map((para, index) => (
                                    <p key={index}>{para}</p>
                                ))}
                            </div>
                        </Card>

                        {/* Questions */}
                        <div className="space-y-6">
                            <Card>
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                                        Pertanyaan {currentQuestion + 1}
                                    </span>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {currentQ.question}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {currentQ.options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelect(index)}
                                            className={`
                        w-full text-left p-4 rounded-lg border-2 transition-all
                        ${selectedAnswer === index
                                                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }
                      `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0
                          ${selectedAnswer === index
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                    }
                        `}>
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                                <span>{option}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </Card>

                            {/* Question Navigator */}
                            <Card>
                                <div className="text-sm text-gray-600 mb-3">Navigasi Soal:</div>
                                <div className="flex flex-wrap gap-2">
                                    {questions.map((q, index) => (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurrentQuestion(index)}
                                            className={`
                        w-10 h-10 rounded-lg text-sm font-medium transition-colors
                        ${currentQuestion === index
                                                    ? 'bg-primary-500 text-white'
                                                    : answers.reading[q.id] !== undefined
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }
                      `}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Button variant="outline" disabled={currentQuestion === 0} onClick={handlePrevious}>
                        <ArrowLeft className="w-5 h-5" />
                        Sebelumnya
                    </Button>

                    {currentQuestion === questions.length - 1 ? (
                        <Button variant="accent" onClick={handleFinishTest}>
                            Selesai & Lihat Hasil
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    ) : (
                        <Button onClick={handleNext}>
                            Selanjutnya
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </footer>
        </div>
    );
}
