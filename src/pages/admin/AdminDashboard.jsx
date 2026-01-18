import { FileQuestion, Users, TrendingUp, Clock } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Soal', value: '156', icon: <FileQuestion className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
        { label: 'Total Pengguna', value: '1,247', icon: <Users className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
        { label: 'Tes Hari Ini', value: '89', icon: <Clock className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
        { label: 'Rata-rata Skor', value: '512', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-amber-100 text-amber-600' },
    ];

    const recentActivity = [
        { type: 'test', message: 'User #245 menyelesaikan tes - 523 pts', time: '5 menit lalu' },
        { type: 'user', message: 'Pengguna baru: john@email.com', time: '15 menit lalu' },
        { type: 'question', message: 'Admin menambahkan 5 soal Listening baru', time: '1 jam lalu' },
        { type: 'test', message: 'User #198 menyelesaikan tes - 487 pts', time: '2 jam lalu' },
    ];

    return (
        <AdminLayout title="Dashboard">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
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
                    {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'test' ? 'bg-green-500' :
                                    activity.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'
                                }`} />
                            <div className="flex-1">
                                <div className="text-gray-900">{activity.message}</div>
                                <div className="text-sm text-gray-500">{activity.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </AdminLayout>
    );
}
