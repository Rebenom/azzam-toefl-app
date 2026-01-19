// API Client for connecting to Next.js backend
const API_BASE_URL = 'https://azzam-toefl-mrd4cn7fa-reanmazes-projects.vercel.app/api';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    }

    async login(email, password) {
        // Use custom login endpoint
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return response.json();
    }

    async getSession() {
        return this.request('/auth/session');
    }

    async logout() {
        return this.request('/auth/signout', { method: 'POST' });
    }

    // User endpoints
    async getProfile() {
        return this.request('/users/me');
    }

    async updateProfile(data) {
        return this.request('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async getUserStats() {
        return this.request('/users/me/stats');
    }

    // Test endpoints
    async startTest() {
        return this.request('/tests/start', { method: 'POST' });
    }

    async getTestHistory() {
        return this.request('/tests/history');
    }

    async getTestSession(testId) {
        return this.request(`/tests/${testId}`);
    }

    async submitAnswer(testId, questionId, selectedAnswer) {
        return this.request(`/tests/${testId}/answer`, {
            method: 'POST',
            body: JSON.stringify({ questionId, selectedAnswer }),
        });
    }

    async nextSection(testId, remainingTime) {
        return this.request(`/tests/${testId}/next-section`, {
            method: 'POST',
            body: JSON.stringify({ remainingTime }),
        });
    }

    async finishTest(testId, remainingTime) {
        return this.request(`/tests/${testId}/finish`, {
            method: 'POST',
            body: JSON.stringify({ remainingTime }),
        });
    }

    async getTestResult(testId) {
        return this.request(`/tests/${testId}/result`);
    }

    // Questions endpoints
    async getQuestions(section, limit, random = true) {
        const params = new URLSearchParams();
        if (section) params.append('section', section);
        if (limit) params.append('limit', limit.toString());
        if (random) params.append('random', 'true');

        return this.request(`/questions?${params.toString()}`);
    }

    // Passages endpoints
    async getPassages() {
        return this.request('/passages');
    }

    async getPassage(id) {
        return this.request(`/passages/${id}`);
    }
}

export const api = new ApiClient();
export default api;
