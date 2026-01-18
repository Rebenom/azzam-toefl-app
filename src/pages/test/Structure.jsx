import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, FileText } from 'lucide-react';
import { useTest } from '../../contexts/TestContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// Sample questions
const sampleQuestions = [
    {
        id: 1,
        question: 'The committee _______ the proposal before the deadline was extended.',
        options: ['has reviewed', 'had reviewed', 'reviewed', 'was reviewing'],
        correctAnswer: 1,
    },
    {
        id: 2,
        question: 'Neither the students nor the teacher _______ aware of the schedule change.',
        options: ['were', 'was', 'are', 'have been'],
        correctAnswer: 1,
    },
    {
        id: 3,
        question: '_______ the rain, the outdoor event was not canceled.',
        options: ['Despite of', 'In spite of', 'Although', 'However'],
        correctAnswer: 1,
    },
];

export default function Structure() {
    const navigate = useNavigate();
    const { answers, setAnswer, updateRemainingTime, sectionTimes, nextSection } = useTest();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(sectionTimes.structure);

    const questions = sampleQuestions;
    const currentQ = questions[currentQuestion];
    const selectedAnswer = answers.structure[currentQ.id];

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinishSection();
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
        setAnswer('structure', currentQ.id, optionIndex);
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

    const handleFinishSection = () => {
        nextSection();
        navigate('/test/reading');
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
                            <FileText className="w-5 h-5" />
                            <span>STRUCTURE SECTION</span>
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
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                                Pertanyaan {currentQuestion + 1}
                            </span>
                            <h2 className="text-xl font-semibold text-gray-900">
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
                      w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
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
                    <Card className="mt-6">
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
                                            : answers.structure[q.id] !== undefined
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
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Button variant="outline" disabled={currentQuestion === 0} onClick={handlePrevious}>
                        <ArrowLeft className="w-5 h-5" />
                        Sebelumnya
                    </Button>

                    {currentQuestion === questions.length - 1 ? (
                        <Button variant="accent" onClick={handleFinishSection}>
                            Lanjut ke Reading
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
