import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    FileQuestion,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <FileQuestion className="w-5 h-5" />, label: 'Bank Soal', path: '/admin/questions' },
    { icon: <Users className="w-5 h-5" />, label: 'Pengguna', path: '/admin/users' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Statistik', path: '/admin/stats' },
    { icon: <Settings className="w-5 h-5" />, label: 'Pengaturan', path: '/admin/settings' },
];

export default function AdminLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-primary-900 text-white
        transform transition-transform duration-300
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex items-center justify-between p-4 border-b border-primary-800">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center font-bold">
                            T
                        </div>
                        <span className="font-bold text-lg">Admin Panel</span>
                    </div>
                    <button
                        className="lg:hidden text-white/70 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-primary-800 transition-colors"
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{user?.name}</div>
                            <div className="text-sm text-white/50 truncate">{user?.email}</div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-white/70 hover:text-white hover:bg-primary-800"
                        onClick={logout}
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 h-16">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden text-gray-600 hover:text-gray-900"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                        </div>
                        <Link to="/dashboard">
                            <Button variant="ghost" size="sm">
                                ← Kembali ke User
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
