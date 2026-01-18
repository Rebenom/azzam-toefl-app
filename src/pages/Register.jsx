import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Password tidak cocok');
            return;
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Gagal mendaftar. Silakan coba lagi.');
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
                        Mulai Perjalanan TOEFL Anda
                    </h1>
                    <p className="text-lg text-primary-100 mb-8">
                        Bergabung dengan ribuan pelajar yang telah berhasil meningkatkan
                        skor TOEFL mereka bersama kami.
                    </p>

                    <div className="space-y-4">
                        {[
                            'Akses ke bank soal lengkap',
                            'Simulasi tes realistis',
                            'Analisis performa detail',
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-primary-100">{item}</span>
                            </div>
                        ))}
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
                            <h2 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h2>
                            <p className="text-gray-600 mt-2">
                                Daftar gratis dan mulai latihan sekarang
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Nama Lengkap"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<User className="w-5 h-5" />}
                                required
                            />

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
                                placeholder="Minimal 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <Input
                                label="Konfirmasi Password"
                                type="password"
                                placeholder="Ulangi password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    required
                                />
                                <span className="text-sm text-gray-600">
                                    Saya menyetujui{' '}
                                    <a href="#" className="text-primary-600 hover:underline">Syarat & Ketentuan</a>
                                    {' '}dan{' '}
                                    <a href="#" className="text-primary-600 hover:underline">Kebijakan Privasi</a>
                                </span>
                            </div>

                            <Button type="submit" className="w-full" size="lg" loading={loading}>
                                Daftar Sekarang
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-gray-600">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                                Masuk
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
