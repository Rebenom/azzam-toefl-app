import { Link } from 'react-router-dom';
import { Trophy, Headphones, FileText, BookOpen, Home, RotateCcw } from 'lucide-react';
import { useTest } from '../../contexts/TestContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function Result() {
    const { answers, resetTest } = useTest();

    // Calculate scores (simplified - would use actual scoring logic)
    const listeningCorrect = Object.keys(answers.listening).length;
    const structureCorrect = Object.keys(answers.structure).length;
    const readingCorrect = Object.keys(answers.reading).length;

    // Simulated converted scores
    const listeningScore = Math.round(31 + (listeningCorrect / 3) * 37);
    const structureScore = Math.round(31 + (structureCorrect / 3) * 37);
    const readingScore = Math.round(31 + (readingCorrect / 3) * 37);

    const totalScore = Math.round((listeningScore + structureScore + readingScore) * 10 / 3);

    const sections = [
        { name: 'Listening', icon: <Headphones className="w-6 h-6" />, score: listeningScore, max: 68, correct: listeningCorrect, total: 50 },
        { name: 'Structure', icon: <FileText className="w-6 h-6" />, score: structureScore, max: 68, correct: structureCorrect, total: 40 },
        { name: 'Reading', icon: <BookOpen className="w-6 h-6" />, score: readingScore, max: 68, correct: readingCorrect, total: 50 },
    ];

    const getScoreColor = (score) => {
        if (score >= 550) return 'text-green-600';
        if (score >= 450) return 'text-yellow-600';
        return 'text-red-600';
    };

    const handleRetry = () => {
        resetTest();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Celebration Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-100 text-accent-600 rounded-full mb-4">
                        <Trophy className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Tes Selesai!</h1>
                    <p className="text-gray-600">Berikut adalah hasil simulasi TOEFL Anda</p>
                </div>

                {/* Total Score */}
                <Card className="text-center mb-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                    <div className="py-8">
                        <div className="text-lg text-primary-200 mb-2">TOTAL SKOR</div>
                        <div className={`text-6xl font-bold mb-2`}>{totalScore}</div>
                        <div className="text-primary-200">dari 677</div>
                    </div>
                </Card>

                {/* Section Breakdown */}
                <Card className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        📊 Rincian Per Section
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-xl text-center"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-3">
                                    {section.icon}
                                </div>
                                <div className="text-sm text-gray-600 mb-1">{section.name}</div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {section.score}/{section.max}
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-primary-500 rounded-full"
                                        style={{ width: `${(section.score / section.max) * 100}%` }}
                                    />
                                </div>
                                <div className="text-sm text-gray-500">
                                    {section.correct}/{section.total} benar
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Score Formula */}
                <Card className="mb-8">
                    <div className="text-sm text-gray-600">
                        <strong>Rumus Konversi Skor:</strong>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-center">
                            ({listeningScore} + {structureScore} + {readingScore}) × 10 ÷ 3 = <strong>{totalScore}</strong>
                        </div>
                        <p className="mt-3 text-gray-500 text-center">
                            ⚠️ Skor ini menggunakan tabel konversi standar TOEFL PBT
                        </p>
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/test" className="flex-1" onClick={handleRetry}>
                        <Button variant="outline" className="w-full" size="lg">
                            <RotateCcw className="w-5 h-5" />
                            Coba Lagi
                        </Button>
                    </Link>
                    <Link to="/dashboard" className="flex-1">
                        <Button variant="primary" className="w-full" size="lg">
                            <Home className="w-5 h-5" />
                            Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
