import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);
            if (user.role === 'admin' || user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Email atau password salah');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-900 p-12 items-center justify-center relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-white max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                            <span className="text-3xl font-bold">A</span>
                        </div>
                        <span className="text-2xl font-bold">Azzam TOEFL</span>
                    </div>

                    <h1 className="text-4xl font-bold mb-6">
                        Selamat Datang Kembali!
                    </h1>
                    <p className="text-lg text-primary-100 mb-8">
                        Lanjutkan perjalanan Anda menuju skor TOEFL impian.
                        Latihan konsisten adalah kunci keberhasilan.
                    </p>

                    <div className="flex items-center gap-4 text-primary-200">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 border-2 border-primary-700 flex items-center justify-center text-sm font-medium text-white">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <span>5,000+ pengguna aktif</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900">Azzam TOEFL</span>
                    </div>

                    <Card padding="lg">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Masuk ke Akun</h2>
                            <p className="text-gray-600 mt-2">
                                Masukkan kredensial Anda untuk melanjutkan
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="w-5 h-5" />}
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                    <span className="text-gray-600">Ingat saya</span>
                                </label>
                                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                                    Lupa password?
                                </a>
                            </div>

                            <Button type="submit" className="w-full" size="lg" loading={loading}>
                                Masuk
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-gray-600">
                            Belum punya akun?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                                Daftar Gratis
                            </Link>
                        </div>
                    </Card>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Dengan masuk, Anda menyetujui{' '}
                        <a href="#" className="text-primary-600 hover:underline">Syarat & Ketentuan</a>
                        {' '}dan{' '}
                        <a href="#" className="text-primary-600 hover:underline">Kebijakan Privasi</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
