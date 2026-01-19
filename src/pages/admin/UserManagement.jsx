import { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
            });
            if (search) params.append('search', search);

            const response = await fetch(`/api/admin/users?${params}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setUsers(data.data);
                    setTotalPages(data.pagination?.totalPages || 1);
                }
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });
            if (response.ok) {
                fetchUsers();
            }
        } catch (err) {
            console.error('Failed to update role:', err);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Yakin ingin menghapus pengguna ini?')) return;

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchUsers();
            }
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <AdminLayout title="Manajemen Pengguna">
            <Card>
                {/* Search */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari pengguna..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Users Table */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Nama</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Role</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Bergabung</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-primary-600" />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{formatDate(user.createdAt)}</td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">
                                            Tidak ada pengguna ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Sebelumnya
                        </Button>
                        <span className="px-4 py-2 text-gray-600">
                            Halaman {page} dari {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                )}
            </Card>
        </AdminLayout>
    );
}
