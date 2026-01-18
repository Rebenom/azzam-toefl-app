import { Link } from 'react-router-dom';
import {
    Headphones,
    FileText,
    BookOpen,
    BarChart3,
    CheckCircle2,
    ArrowRight,
    Star,
    Users,
    Trophy
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Landing() {
    const features = [
        {
            icon: <Headphones className="w-8 h-8" />,
            title: 'Listening Section',
            description: 'Latihan dengan audio berkualitas tinggi dan soal standar TOEFL',
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: 'Structure Section',
            description: 'Kuasai grammar dan struktur kalimat bahasa Inggris',
        },
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: 'Reading Section',
            description: 'Tingkatkan pemahaman bacaan dengan passage akademik',
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: 'Skor Otomatis',
            description: 'Dapatkan hasil instant dengan konversi skor standar ETS',
        },
    ];

    const stats = [
        { icon: <Users />, value: '5,000+', label: 'Pengguna Aktif' },
        { icon: <Trophy />, value: '95%', label: 'Tingkat Kelulusan' },
        { icon: <Star />, value: '4.9', label: 'Rating Pengguna' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            Platform Simulasi TOEFL #1 di Indonesia
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Persiapkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">TOEFL</span> Anda
                            <br />dengan Simulasi Nyata
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            Latihan Listening, Structure, & Reading dengan sistem penilaian otomatis
                            standar ETS. Tingkatkan skor TOEFL Anda sekarang!
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="xl" variant="accent" className="shadow-lg shadow-accent-500/30">
                                    <span>Mulai Gratis</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/#features">
                                <Button size="xl" variant="outline">
                                    Pelajari Lebih Lanjut
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Gratis untuk dicoba</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Tidak perlu kartu kredit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-primary-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center justify-center gap-4 text-white">
                                <div className="p-3 bg-white/10 rounded-lg">
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                    <div className="text-gray-300">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Fitur Lengkap untuk Persiapan Maksimal
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Semua yang Anda butuhkan untuk meraih skor TOEFL impian dalam satu platform
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                hover
                                className="group text-center"
                            >
                                <div className="inline-flex p-4 bg-primary-50 text-primary-600 rounded-xl mb-4 group-hover:bg-primary-100 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Cara Kerja
                        </h2>
                        <p className="text-lg text-gray-600">
                            Tiga langkah mudah untuk memulai latihan TOEFL
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Daftar Akun', desc: 'Buat akun gratis dalam hitungan detik' },
                            { step: '02', title: 'Mulai Tes', desc: 'Pilih simulasi dan kerjakan soal-soal TOEFL' },
                            { step: '03', title: 'Lihat Hasil', desc: 'Dapatkan skor dan analisis performa Anda' },
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-6 left-[calc(100%_-_2rem)] w-[calc(100%_-_4rem)] border-t-2 border-dashed border-gray-300"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center" padding="lg">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Siap Meningkatkan Skor TOEFL Anda?
                        </h2>
                        <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                            Bergabung dengan ribuan pengguna yang telah berhasil meraih skor TOEFL impian mereka
                        </p>
                        <Link to="/register">
                            <Button size="xl" variant="accent" className="shadow-lg">
                                Daftar Sekarang - Gratis!
                            </Button>
                        </Link>
                    </Card>
                </div>
            </section>

            <Footer />
        </div>
    );
}
