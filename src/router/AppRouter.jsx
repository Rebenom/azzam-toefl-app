import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { TestProvider } from '../contexts/TestContext';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import TestInstructions from '../pages/test/TestInstructions';
import Listening from '../pages/test/Listening';
import Structure from '../pages/test/Structure';
import Reading from '../pages/test/Reading';
import Result from '../pages/test/Result';
import History from '../pages/History';
import Profile from '../pages/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import QuestionBank from '../pages/admin/QuestionBank';
import UserManagement from '../pages/admin/UserManagement';
import Statistics from '../pages/admin/Statistics';

// Components
import ProtectedRoute from '../components/layout/ProtectedRoute';
import AdminRoute from '../components/layout/AdminRoute';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <TestProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected User Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/test" element={<TestInstructions />} />
                            <Route path="/test/listening" element={<Listening />} />
                            <Route path="/test/structure" element={<Structure />} />
                            <Route path="/test/reading" element={<Reading />} />
                            <Route path="/test/result" element={<Result />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/questions" element={<QuestionBank />} />
                            <Route path="/admin/users" element={<UserManagement />} />
                            <Route path="/admin/stats" element={<Statistics />} />
                        </Route>
                    </Routes>
                </TestProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
