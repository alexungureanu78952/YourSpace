import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

describe('API Configuration', () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_URL;

    afterEach(() => {
        process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });

    it('uses default URL when NEXT_PUBLIC_API_URL is not set', () => {
        delete process.env.NEXT_PUBLIC_API_URL;
        // Re-require the module to get fresh values
        jest.resetModules();
        const api = require('../../config/api').default;
        expect(api).toBe('http://localhost:5000');
    });

    it('uses environment variable when NEXT_PUBLIC_API_URL is set', () => {
        process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
        jest.resetModules();
        const api = require('../../config/api').default;
        expect(api).toBe('https://api.example.com');
    });

    it('exposes correct API endpoints', () => {
        expect(API_ENDPOINTS.users).toBe(`${API_BASE_URL}/api/users`);
        expect(API_ENDPOINTS.health).toBe(`${API_BASE_URL}/api/health`);
    });

    it('generates correct user detail endpoint', () => {
        const userId = 123;
        expect(API_ENDPOINTS.userDetail(userId)).toBe(`${API_BASE_URL}/api/users/${userId}`);
    });

    it('generates user detail endpoint with different IDs', () => {
        expect(API_ENDPOINTS.userDetail(1)).toBe(`${API_BASE_URL}/api/users/1`);
        expect(API_ENDPOINTS.userDetail(999)).toBe(`${API_BASE_URL}/api/users/999`);
    });
});
