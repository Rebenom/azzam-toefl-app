import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Loader2, X } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function QuestionBank() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [section, setSection] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [formData, setFormData] = useState({
        section: 'LISTENING',
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        difficulty: 'MEDIUM',
    });

    useEffect(() => {
        fetchQuestions();
    }, [page, section, search]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
            });
            if (section) params.append('section', section);
            if (search) params.append('search', search);

            const response = await fetch(`/api/admin/questions?${params}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setQuestions(data.data);
                    setTotalPages(data.pagination?.totalPages || 1);
                }
            }
        } catch (err) {
            console.error('Failed to fetch questions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingQuestion
                ? `/api/admin/questions/${editingQuestion.id}`
                : '/api/admin/questions';

            const response = await fetch(url, {
                method: editingQuestion ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowModal(false);
                setEditingQuestion(null);
                resetForm();
                fetchQuestions();
            }
        } catch (err) {
            console.error('Failed to save question:', err);
        }
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setFormData({
            section: question.section,
            questionText: question.questionText,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD || '',
            correctAnswer: question.correctAnswer,
            difficulty: question.difficulty,
        });
        setShowModal(true);
    };

    const handleDelete = async (questionId) => {
        if (!window.confirm('Yakin ingin menghapus soal ini?')) return;

        try {
            const response = await fetch(`/api/admin/questions/${questionId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchQuestions();
            }
        } catch (err) {
            console.error('Failed to delete question:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            section: 'LISTENING',
            questionText: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctAnswer: 'A',
            difficulty: 'MEDIUM',
        });
    };

    const getSectionBadge = (section) => {
        const colors = {
            LISTENING: 'bg-blue-100 text-blue-700',
            STRUCTURE: 'bg-green-100 text-green-700',
            READING: 'bg-purple-100 text-purple-700',
        };
        return colors[section] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AdminLayout title="Bank Soal">
            <Card>
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                    <div className="flex gap-4 flex-1">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari soal..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <select
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">Semua Section</option>
                            <option value="LISTENING">Listening</option>
                            <option value="STRUCTURE">Structure</option>
                            <option value="READING">Reading</option>
                        </select>
                    </div>
                    <Button onClick={() => { resetForm(); setEditingQuestion(null); setShowModal(true); }}>
                        <Plus className="w-4 h-4" /> Tambah Soal
                    </Button>
                </div>

                {/* Questions List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.length > 0 ? (
                            questions.map((question) => (
                                <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getSectionBadge(question.section)}`}>
                                                    {question.section}
                                                </span>
                                                <span className="text-xs text-gray-500">{question.difficulty}</span>
                                            </div>
                                            <p className="text-gray-900 mb-2">{question.questionText}</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className={question.correctAnswer === 'A' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                                    A. {question.optionA}
                                                </div>
                                                <div className={question.correctAnswer === 'B' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                                    B. {question.optionB}
                                                </div>
                                                <div className={question.correctAnswer === 'C' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                                    C. {question.optionC}
                                                </div>
                                                {question.optionD && (
                                                    <div className={question.correctAnswer === 'D' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                                        D. {question.optionD}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(question)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(question.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Tidak ada soal ditemukan
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                            Sebelumnya
                        </Button>
                        <span className="px-4 py-2 text-gray-600">Halaman {page} dari {totalPages}</span>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                            Selanjutnya
                        </Button>
                    </div>
                )}
            </Card>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold">{editingQuestion ? 'Edit Soal' : 'Tambah Soal Baru'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                    <select
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="LISTENING">Listening</option>
                                        <option value="STRUCTURE">Structure</option>
                                        <option value="READING">Reading</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="EASY">Easy</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HARD">Hard</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                                <textarea
                                    value={formData.questionText}
                                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Opsi A</label>
                                    <input
                                        type="text"
                                        value={formData.optionA}
                                        onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Opsi B</label>
                                    <input
                                        type="text"
                                        value={formData.optionB}
                                        onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Opsi C</label>
                                    <input
                                        type="text"
                                        value={formData.optionC}
                                        onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Opsi D (opsional)</label>
                                    <input
                                        type="text"
                                        value={formData.optionD}
                                        onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban Benar</label>
                                <select
                                    value={formData.correctAnswer}
                                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                                <Button type="submit">{editingQuestion ? 'Simpan' : 'Tambah'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
