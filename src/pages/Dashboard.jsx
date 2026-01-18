import { Link } from 'react-router-dom';
import {
    Play,
    History,
    User,
    TrendingUp,
    Award,
    Target,
    ChevronRight,
    Headphones,
    FileText,
    BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Dashboard() {
    const { user } = useAuth();

    const stats = [
        { label: 'Skor Tertinggi', value: '523', icon: <Award className="w-6 h-6" />, color: 'text-accent-500' },
        { label: 'Tes Selesai', value: '5', icon: <Target className="w-6 h-6" />, color: 'text-primary-500' },
        { label: 'Akurasi', value: '68%', icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-500' },
        { label: 'Tes Terakhir', value: 'Jan 15', icon: <History className="w-6 h-6" />, color: 'text-purple-500' },
    ];

    const recentTests = [
        { id: 5, score: 523, date: '15 Jan 2026', listening: 52, structure: 55, reading: 54 },
        { id: 4, score: 487, date: '10 Jan 2026', listening: 48, structure: 50, reading: 49 },
        { id: 3, score: 512, date: '5 Jan 2026', listening: 51, structure: 53, reading: 52 },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Selamat Datang, {user?.name}! 👋
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Lanjutkan persiapan TOEFL Anda hari ini
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <Card key={index} className="flex items-center gap-4">
                                <div className={`p-3 bg-gray-100 rounded-lg ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Start Test CTA */}
                    <Card className="mb-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold mb-2">🚀 Mulai Tes Baru</h2>
                                <p className="text-primary-100 max-w-lg">
                                    Simulasi lengkap dengan 3 section: Listening • Structure • Reading.
                                    Waktu pengerjaan sekitar 2 jam.
                                </p>
                            </div>
                            <Link to="/test">
                                <Button variant="accent" size="xl" className="shadow-lg whitespace-nowrap">
                                    <Play className="w-5 h-5" />
                                    Mulai Tes Sekarang
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Tests */}
                        <Card className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Riwayat Tes Terbaru</h3>
                                <Link to="/history" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                                    Lihat Semua <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {recentTests.map((test) => (
                                    <div
                                        key={test.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold">
                                                #{test.id}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Tes #{test.id}</div>
                                                <div className="text-sm text-gray-500">{test.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Headphones className="w-4 h-4" /> {test.listening}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FileText className="w-4 h-4" /> {test.structure}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <BookOpen className="w-4 h-4" /> {test.reading}
                                                </span>
                                            </div>
                                            <div className="text-xl font-bold text-primary-600">
                                                {test.score}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Menu Cepat</h3>
                            <div className="space-y-3">
                                <Link to="/test" className="block">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                        <Play className="w-5 h-5" />
                                        <span className="font-medium">Mulai Simulasi Baru</span>
                                    </div>
                                </Link>
                                <Link to="/history" className="block">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                        <History className="w-5 h-5" />
                                        <span className="font-medium">Lihat Riwayat</span>
                                    </div>
                                </Link>
                                <Link to="/profile" className="block">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">Edit Profil</span>
                                    </div>
                                </Link>
                            </div>

                            {/* Tips Card */}
                            <div className="mt-6 p-4 bg-accent-50 rounded-lg border border-accent-200">
                                <div className="text-accent-700 font-medium mb-1">💡 Tips Hari Ini</div>
                                <p className="text-sm text-accent-600">
                                    Latihan listening secara konsisten 30 menit sehari dapat meningkatkan skor hingga 15 poin!
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
