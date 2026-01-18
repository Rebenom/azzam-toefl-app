import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900">Azzam TOEFL</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/#features" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                            Fitur
                        </Link>
                        <Link to="/#about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                            Tentang
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard">
                                    <Button variant="ghost">Dashboard</Button>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Halo, {user?.name}</span>
                                    <Button variant="outline" size="sm" onClick={logout}>
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost">Masuk</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="accent">Daftar Gratis</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-4 space-y-4">
                        <Link
                            to="/#features"
                            className="block text-gray-600 hover:text-primary-600 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Fitur
                        </Link>
                        <Link
                            to="/#about"
                            className="block text-gray-600 hover:text-primary-600 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Tentang
                        </Link>
                        <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                                        <Button variant="primary" className="w-full">Dashboard</Button>
                                    </Link>
                                    <Button variant="outline" onClick={() => { logout(); setIsOpen(false); }}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">Masuk</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <Button variant="accent" className="w-full">Daftar Gratis</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
