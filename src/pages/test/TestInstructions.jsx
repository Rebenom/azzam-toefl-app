import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, FileText, BookOpen, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTest } from '../../contexts/TestContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function TestInstructions() {
    const navigate = useNavigate();
    const { startTest } = useTest();
    const [agreed, setAgreed] = useState(false);

    const handleStartTest = () => {
        startTest();
        navigate('/test/listening');
    };

    const sections = [
        { icon: <Headphones className="w-6 h-6" />, name: 'Listening', questions: 50, time: '35 menit' },
        { icon: <FileText className="w-6 h-6" />, name: 'Structure', questions: 40, time: '25 menit' },
        { icon: <BookOpen className="w-6 h-6" />, name: 'Reading', questions: 50, time: '55 menit' },
    ];

    const rules = [
        'Audio Listening hanya dapat diputar SATU KALI',
        'Jawaban tersimpan otomatis saat Anda memilih',
        'Anda tidak bisa kembali ke section sebelumnya',
        'Tes akan otomatis berakhir jika waktu habis',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Timer Preview */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-primary-900 text-white px-6 py-3 rounded-full">
                        <Clock className="w-5 h-5" />
                        <span className="text-xl font-mono font-bold">02:00:00</span>
                    </div>
                </div>

                <Card padding="lg">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            📋 Petunjuk Pengerjaan
                        </h1>
                        <p className="text-gray-600">
                            Baca dengan seksama sebelum memulai tes
                        </p>
                    </div>

                    {/* Sections Overview */}
                    <div className="mb-8">
                        <h2 className="font-semibold text-gray-900 mb-4">Tes ini terdiri dari 3 bagian:</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                                        {section.icon}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{section.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {section.questions} soal • {section.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rules */}
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-700 font-semibold mb-3">
                            <AlertTriangle className="w-5 h-5" />
                            Perhatian:
                        </div>
                        <ul className="space-y-2">
                            {rules.map((rule, index) => (
                                <li key={index} className="flex items-start gap-2 text-amber-700">
                                    <span className="text-amber-500">•</span>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Agreement Checkbox */}
                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer mb-6">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className={`w-5 h-5 ${agreed ? 'text-green-500' : 'text-gray-400'}`} />
                            <span className="text-gray-700">
                                Saya memahami dan siap memulai tes
                            </span>
                        </div>
                    </label>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate('/dashboard')}
                        >
                            Kembali ke Dashboard
                        </Button>
                        <Button
                            variant="accent"
                            className="flex-1"
                            disabled={!agreed}
                            onClick={handleStartTest}
                        >
                            🚀 Mulai Tes
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
