import { useState, useEffect } from 'react';
import { FileQuestion, Users, TrendingUp, Clock, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch overview stats
            const statsResponse = await fetch('/api/admin/stats/overview');
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                if (statsData.success) {
                    setStats(statsData.data);
                }
            }

            // Fetch recent activity
            const activityResponse = await fetch('/api/admin/activity');
            if (activityResponse.ok) {
                const activityData = await activityResponse.json();
                if (activityData.success) {
                    setActivity(activityData.data.slice(0, 5));
                }
            }
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Soal', value: stats?.totalQuestions || 0, icon: <FileQuestion className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
        { label: 'Total Pengguna', value: stats?.totalUsers || 0, icon: <Users className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
        { label: 'Tes Hari Ini', value: stats?.testsToday || 0, icon: <Clock className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
        { label: 'Rata-rata Skor', value: Math.round(stats?.averageScore || 0), icon: <TrendingUp className="w-6 h-6" />, color: 'bg-amber-100 text-amber-600' },
    ];

    return (
        <AdminLayout title="Dashboard">
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((stat, index) => (
                            <Card key={index} className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Charts Placeholder */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Tes Per Hari (30 Hari Terakhir)</h3>
                            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                Chart akan ditampilkan di sini
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Distribusi Skor</h3>
                            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                Chart akan ditampilkan di sini
                            </div>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Aktivitas Terbaru</h3>
                        <div className="space-y-4">
                            {activity.length > 0 ? (
                                activity.map((item, index) => (
                                    <div key={item.id || index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${item.type === 'TEST_COMPLETED' ? 'bg-green-500' :
                                                item.type === 'USER_REGISTERED' ? 'bg-blue-500' : 'bg-purple-500'
                                            }`} />
                                        <div className="flex-1">
                                            <div className="text-gray-900">{item.message}</div>
                                            <div className="text-sm text-gray-500">{item.timeAgo}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Belum ada aktivitas terbaru
                                </div>
                            )}
                        </div>
                    </Card>
                </>
            )}
        </AdminLayout>
    );
}
