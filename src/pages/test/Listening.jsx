import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Headphones, Volume2, VolumeX } from 'lucide-react';
import { useTest } from '../../contexts/TestContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// Sample questions (replace with API data)
const sampleQuestions = [
    {
        id: 1,
        audioUrl: null, // Would be actual audio URL
        question: 'What is the main topic of the conversation?',
        options: [
            'The history of the university',
            'Course registration procedures',
            'Campus facilities and services',
            'Student housing options',
        ],
        correctAnswer: 1,
    },
    {
        id: 2,
        audioUrl: null,
        question: 'What does the professor mainly discuss?',
        options: [
            'The evolution of digital technology',
            'Environmental conservation methods',
            'Ancient architectural techniques',
            'Modern economic theories',
        ],
        correctAnswer: 0,
    },
    {
        id: 3,
        audioUrl: null,
        question: 'According to the speaker, what is the primary benefit?',
        options: [
            'Reduced operational costs',
            'Improved efficiency',
            'Better customer satisfaction',
            'Increased market share',
        ],
        correctAnswer: 1,
    },
];

export default function Listening() {
    const navigate = useNavigate();
    const { answers, setAnswer, updateRemainingTime, sectionTimes, nextSection } = useTest();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(sectionTimes.listening);
    const [audioPlayed, setAudioPlayed] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const questions = sampleQuestions;
    const currentQ = questions[currentQuestion];
    const selectedAnswer = answers.listening[currentQ.id];

    // Timer
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

    // Update context time
    useEffect(() => {
        updateRemainingTime(timeLeft);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (optionIndex) => {
        setAnswer('listening', currentQ.id, optionIndex);
    };

    const handlePlayAudio = () => {
        if (audioPlayed[currentQ.id]) return;
        setIsPlaying(true);
        // Simulate audio playback
        setTimeout(() => {
            setIsPlaying(false);
            setAudioPlayed(prev => ({ ...prev, [currentQ.id]: true }));
        }, 3000);
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
        navigate('/test/structure');
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
                            <Headphones className="w-5 h-5" />
                            <span>LISTENING SECTION</span>
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

                {/* Progress Bar */}
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
                    {/* Audio Player */}
                    <Card className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                                    <Headphones className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Audio Player</div>
                                    <div className="text-sm text-gray-500">
                                        {audioPlayed[currentQ.id] ? 'Audio sudah diputar' : 'Klik untuk memutar audio'}
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant={audioPlayed[currentQ.id] ? 'ghost' : 'primary'}
                                disabled={audioPlayed[currentQ.id] || isPlaying}
                                onClick={handlePlayAudio}
                            >
                                {isPlaying ? (
                                    <>
                                        <div className="animate-pulse flex items-center gap-1">
                                            <span className="w-1 h-4 bg-current animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1 h-6 bg-current animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1 h-4 bg-current animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                        <span>Memutar...</span>
                                    </>
                                ) : audioPlayed[currentQ.id] ? (
                                    <>
                                        <VolumeX className="w-5 h-5" />
                                        <span>Sudah Diputar</span>
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="w-5 h-5" />
                                        <span>Putar Audio</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {!audioPlayed[currentQ.id] && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                                ⚠️ Audio hanya dapat diputar satu kali
                            </div>
                        )}
                    </Card>

                    {/* Question */}
                    <Card>
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                                Pertanyaan {currentQuestion + 1}
                            </span>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {currentQ.question}
                            </h2>
                        </div>

                        {/* Options */}
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
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Button
                        variant="outline"
                        disabled={currentQuestion === 0}
                        onClick={handlePrevious}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Sebelumnya
                    </Button>

                    {/* Question Navigator */}
                    <div className="hidden sm:flex items-center gap-1">
                        {questions.map((q, index) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestion(index)}
                                className={`
                  w-8 h-8 rounded-lg text-sm font-medium transition-colors
                  ${currentQuestion === index
                                        ? 'bg-primary-500 text-white'
                                        : answers.listening[q.id] !== undefined
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }
                `}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {currentQuestion === questions.length - 1 ? (
                        <Button variant="accent" onClick={handleFinishSection}>
                            Lanjut ke Structure
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
