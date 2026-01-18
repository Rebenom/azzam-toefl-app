import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';

export default function Profile() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Saya</h1>
                    <Card>
                        <p className="text-gray-600">Halaman profil akan segera hadir.</p>
                    </Card>
                </div>
            </main>
        </div>
    );
}
