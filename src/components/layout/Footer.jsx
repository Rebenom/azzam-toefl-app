import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-primary-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">A</span>
                            </div>
                            <span className="font-bold text-xl">Azzam TOEFL</span>
                        </div>
                        <p className="text-gray-400 max-w-sm">
                            Platform simulasi TOEFL terbaik untuk persiapan ujian Anda.
                            Latihan dengan soal berkualitas dan sistem penilaian otomatis.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Menu</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link to="/#features" className="text-gray-400 hover:text-white transition-colors">
                                    Fitur
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                                    Masuk
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                                    Daftar
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Kontak</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>support@toeflsim.com</li>
                            <li>+62 812 3456 7890</li>
                            <li>Jakarta, Indonesia</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Azzam TOEFL. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
