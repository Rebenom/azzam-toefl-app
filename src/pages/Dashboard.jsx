import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Play,
    History,
    TrendingUp,
    Award,
    Target,
    ChevronRight,
    Headphones,
    FileText,
    BookOpen,
    Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.getUserStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            // Set empty stats if API fails
            setStats({
                totalTests: 0,
                highestScore: 0,
                averageScore: 0,
                recentTests: []
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const statsCards = [
        { label: 'Skor Tertinggi', value: stats?.highestScore || 0, icon: <Award className="w-6 h-6" />, color: 'text-accent-500' },
        { label: 'Tes Selesai', value: stats?.totalTests || 0, icon: <Target className="w-6 h-6" />, color: 'text-primary-500' },
        { label: 'Rata-rata', value: Math.round(stats?.averageScore || 0), icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-500' },
        { label: 'Tes Terakhir', value: stats?.recentTests?.[0] ? formatDate(stats.recentTests[0].completedAt) : '-', icon: <History className="w-6 h-6" />, color: 'text-purple-500' },
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
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {statsCards.map((stat, index) => (
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
                    )}

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

                    {/* Test Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card className="hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                    <Headphones className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Listening</h3>
                                    <p className="text-sm text-gray-500">50 soal • 35 menit</p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Uji kemampuan mendengarkan percakapan dan ceramah dalam Bahasa Inggris.
                            </p>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Structure</h3>
                                    <p className="text-sm text-gray-500">40 soal • 25 menit</p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Tes pemahaman tata bahasa dan struktur kalimat Bahasa Inggris.
                            </p>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Reading</h3>
                                    <p className="text-sm text-gray-500">50 soal • 55 menit</p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Uji kemampuan memahami teks akademik dalam Bahasa Inggris.
                            </p>
                        </Card>
                    </div>

                    {/* Recent Tests */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">📊 Riwayat Tes Terakhir</h3>
                            <Link to="/history" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                                Lihat Semua <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : stats?.recentTests?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentTests.slice(0, 3).map((test, index) => (
                                    <div key={test.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-gray-900">Tes #{index + 1}</div>
                                            <div className="text-sm text-gray-500">{formatDate(test.completedAt)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-primary-600">{test.totalScore}</div>
                                            <div className="text-xs text-gray-500">
                                                L:{test.listeningScore} • S:{test.structureScore} • R:{test.readingScore}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>Belum ada riwayat tes.</p>
                                <p className="text-sm mt-1">Mulai tes pertama Anda sekarang!</p>
                            </div>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    );
}
